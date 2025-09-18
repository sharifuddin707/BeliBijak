import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import bodyParser from "body-parser";
import fs from "fs";
const serviceAccount = JSON.parse(fs.readFileSync(new URL("./serviceAccountKey.json", import.meta.url)));

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

// listening for requests
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});