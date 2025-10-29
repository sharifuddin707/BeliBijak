import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import bodyParser from "body-parser";

// Fetch the service account key JSON file contents from environment variable in Render
const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
if (!key) {
  throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set');
}
const serviceAccount = JSON.parse(key);

// initializing database app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore(); // access the database as admin

// Test Firebase connection (must be after db is initialized)
db.collection("test_connection").add({ test: "ok", timestamp: Date.now() })
  .then(() => console.log("Firebase connection: SUCCESS"))
  .catch((err) => console.error("Firebase connection: FAILED", err));

const app = express();
app.use(cors());
const port = 3000;

app.use(bodyParser.json()); // parse json files

// Try to load TFJS model if available. Use dynamic import so app still runs if dependency missing.
let model = null;
let modelMetadata = null;
try {
  const tf = await import('@tensorflow/tfjs-node');
  try {
    // model saved at ./ml/model
    const modelPath = 'file://./ml/model';
    model = await tf.loadLayersModel(modelPath + '/model.json');
    // attempt to read metadata
    try {
      const meta = await import('fs/promises');
      const md = JSON.parse(await meta.readFile('./ml/metadata.json', 'utf8'));
      modelMetadata = md;
      console.log('Loaded TFJS model with metadata', md);
    } catch (err) {
      console.warn('Model loaded but metadata not found');
    }
  } catch (err) {
    console.log('No TFJS model found or failed to load, continuing with heuristic.');
    model = null;
  }
} catch (err) {
  console.log('@tensorflow/tfjs-node not installed or failed to import — model inference disabled.');
}

// handle user get requests
app.get('/users', async (req, res) => {
  console.log('GET /users');
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("problem 1");
  }
});

// handle user post requests
app.post('/users', async (req, res) => {
  console.log('POST /users', req.body);
  try {
    const { name, email } = req.body;
    const docRef = await db.collection("users").add({ name, email });
    res.json({ id: docRef.id, name, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("problem 2");
  }
});


// handle get grocery stores requests
app.get('/stores', async (req, res) => {
  console.log('GET /stores');
  try {
    const snapshot = await db.collection("stores").get();
    const stores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("problem getting stores");
  }
});

// handle post grocery store requests
app.post('/stores', async (req, res) => {
  console.log('POST /stores', req.body);
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Store name is required' });
    const docRef = await db.collection("stores").add({ name });
    res.json({ id: docRef.id, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("problem adding store");
  }
});

// UPDATE a grocery store by id
app.put('/stores/:id', async (req, res) => {
  try {
    console.log('PUT /stores/:id', req.params, req.body);
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Store name is required' });
    await db.collection("stores").doc(id).update({ name });
    res.json({ id, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("problem updating store");
  }
});

// DELETE a grocery store by id
app.delete('/stores/:id', async (req, res) => {
  try {
    console.log('DELETE /stores/:id', req.params);
    const { id } = req.params;
    await db.collection("stores").doc(id).delete();
    res.json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("problem deleting store");
  }
});

// ML heuristic endpoint: price insight
app.post('/ml/price_insight', async (req, res) => {
  try {
    const { itemName, currentPrice, storeId } = req.body || {};
    if (!itemName) return res.status(400).json({ error: 'itemName is required' });
    // If a model is loaded, use it for prediction
    if (model && modelMetadata) {
      try {
        // construct feature vector using metadata
        const { items = [], stores = [], numItems = 0 } = modelMetadata;
        const feat = new Array(modelMetadata.featureLen).fill(0);
        const itIdx = items.indexOf(itemName);
        if (itIdx >= 0) feat[itIdx] = 1;
        const stIdx = storeId ? stores.indexOf(storeId) : -1;
        if (stIdx >= 0) feat[numItems + stIdx] = 1;
        const tf = await import('@tensorflow/tfjs-node');
        const x = tf.tensor2d([feat]);
        const pred = model.predict(x);
        const predVal = Array.isArray(pred.dataSync) ? pred.dataSync()[0] : pred.dataSync()[0];
        x.dispose();
        return res.json({ recommendation: 'model_price', predictedPrice: predVal, message: 'Predicted price from model' });
      } catch (err) {
        console.error('Model prediction failed', err);
        // fall through to heuristic
      }
    }

    // Look for a 'prices' collection with documents: { itemName, storeId, price }
    const pricesSnap = await db.collection('prices').where('itemName', '==', itemName).get();
    if (pricesSnap.empty) {
      return res.json({
        recommendation: 'no_data',
        score: 0,
        message: `No historical price data found for ${itemName}`
      });
    }

    // Aggregate average price per store
    const storeTotals = {};
    pricesSnap.docs.forEach(doc => {
      const d = doc.data();
      const s = d.storeId || 'unknown';
      const p = Number(d.price) || 0;
      if (!storeTotals[s]) storeTotals[s] = { sum: 0, count: 0 };
      storeTotals[s].sum += p;
      storeTotals[s].count += 1;
    });

    const storeAvgs = Object.entries(storeTotals).map(([s, v]) => ({ storeId: s, avgPrice: v.sum / v.count }));
    // Find overall lowest average
    storeAvgs.sort((a, b) => a.avgPrice - b.avgPrice);
    const cheapest = storeAvgs[0];

    // If user provided currentPrice and storeId, compare
    if (currentPrice && storeId) {
      const expected = storeAvgs.find(s => s.storeId === storeId)?.avgPrice;
      const diff = expected ? (currentPrice - expected) / expected : null;
      let recommendation = 'fair_price';
      if (diff !== null) {
        if (diff > 0.2) recommendation = 'expensive';
        else if (diff < -0.15) recommendation = 'cheaper_here';
      }
      return res.json({
        recommendation,
        score: diff === null ? 0 : Math.min(1, Math.abs(diff)),
        expectedPrice: expected || null,
        suggestedStore: cheapest,
        message: `Compared ${storeId} price to historical averages for ${itemName}`
      });
    }

    // If no current price, just suggest the cheapest store from history
    return res.json({
      recommendation: 'cheaper_store',
      score: 0.9,
      suggestedStore: cheapest,
      message: `Based on historical prices, ${cheapest.storeId} has the lowest average price for ${itemName}`
    });
  } catch (err) {
    console.error('ML endpoint error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// listening for requests
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});