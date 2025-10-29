/*
  Training script for price prediction model.
  Usage: set environment variable GOOGLE_SERVICE_ACCOUNT_KEY (same as server.js) then run:
    node train_price_model.js

  Requirements: this script uses @tensorflow/tfjs-node. Install it in an environment where
  prebuilt binaries are available (Linux or macOS recommended) or ensure Windows build tools are installed.

  The script will:
  - Read Firestore 'prices' collection documents { itemName, storeId, price }
  - Build simple one-hot features for item and store
  - Train a small MLP regression model to predict price
  - Save model to ./ml/model and metadata to ./ml/metadata.json
*/

import fs from 'fs/promises';
import path from 'path';

// dynamic import of tfjs-node so script fails gracefully if not installed
let tf;
try {
  tf = await import('@tensorflow/tfjs-node');
} catch (err) {
  console.error('This script requires @tensorflow/tfjs-node. Install it before running.');
  console.error('On Windows you may need Visual Studio Build Tools; using Linux/macOS is easier.');
  process.exit(1);
}

import admin from 'firebase-admin';

const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
if (!key) {
  console.error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set');
  process.exit(1);
}
const serviceAccount = JSON.parse(key);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function main() {
  console.log('Fetching price data from Firestore...');
  const snap = await db.collection('prices').get();
  if (snap.empty) {
    console.error('No documents found in collection `prices`. Add data like { itemName, storeId, price }');
    process.exit(1);
  }

  const rows = snap.docs.map(d => d.data());

  // build maps
  const itemSet = new Set();
  const storeSet = new Set();
  for (const r of rows) {
    if (r.itemName) itemSet.add(String(r.itemName));
    if (r.storeId) storeSet.add(String(r.storeId));
  }
  const items = Array.from(itemSet);
  const stores = Array.from(storeSet);
  const itemIndex = Object.fromEntries(items.map((v,i) => [v,i]));
  const storeIndex = Object.fromEntries(stores.map((v,i) => [v,i]));

  const numItems = items.length;
  const numStores = stores.length;
  const featureLen = numItems + numStores;

  const xs = [];
  const ys = [];
  for (const r of rows) {
    const it = String(r.itemName);
    const st = String(r.storeId || 'unknown');
    const price = Number(r.price);
    const feat = new Array(featureLen).fill(0);
    if (itemIndex[it] !== undefined) feat[itemIndex[it]] = 1;
    if (storeIndex[st] !== undefined) feat[numItems + storeIndex[st]] = 1;
    xs.push(feat);
    ys.push([price]);
  }

  const xT = tf.tensor2d(xs);
  const yT = tf.tensor2d(ys);

  console.log('Building model... (input shape', featureLen, ')');
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [featureLen], units: 64, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));
  model.compile({ optimizer: tf.train.adam(0.001), loss: 'meanSquaredError' });

  console.log('Training model...');
  await model.fit(xT, yT, { epochs: 30, batchSize: 32, shuffle: true });

  const outDir = path.join('.', 'ml', 'model');
  await fs.mkdir(path.dirname(outDir), { recursive: true });
  console.log('Saving model to', outDir);
  await model.save('file://' + outDir);

  const metadata = { items, stores, numItems, numStores, featureLen };
  await fs.writeFile(path.join('.', 'ml', 'metadata.json'), JSON.stringify(metadata, null, 2));

  console.log('Training finished. Model and metadata saved.');
  xT.dispose(); yT.dispose();
}

main().catch(err => {
  console.error('Training failed:', err);
  process.exit(1);
});
