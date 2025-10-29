// Script to add dummy grocery store data to Firestore
// Usage: node backend/addDummyData.cjs

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const dummyStores = [
{ itemName: 'Bread', price: 1.4, storeId: 'Hua Ho' },
{ itemName: 'Milk', price: 3.1, storeId: 'SKH' },
{ itemName: 'Eggs', price: 3.8, storeId: 'Supasave' },
{ itemName: 'Rice', price: 9.2, storeId: 'Soon Lee' },
{ itemName: 'Oil', price: 4.5, storeId: 'Hua Ho' },
{ itemName: 'Juice', price: 3.6, storeId: 'SKH' },
{ itemName: 'Water', price: 0.9, storeId: 'Supasave' },
{ itemName: 'Soda', price: 1.5, storeId: 'Soon Lee' },
{ itemName: 'Noodles', price: 2.4, storeId: 'Hua Ho' },
{ itemName: 'Chips', price: 2.0, storeId: 'SKH' },
{ itemName: 'Biscuits', price: 2.8, storeId: 'Supasave' },
{ itemName: 'Candy', price: 1.2, storeId: 'Soon Lee' },
{ itemName: 'Chocolate', price: 3.3, storeId: 'Hua Ho' },
{ itemName: 'Icecream', price: 4.1, storeId: 'SKH' },
{ itemName: 'Butter', price: 3.7, storeId: 'Supasave' },
{ itemName: 'Cheese', price: 4.6, storeId: 'Soon Lee' },
{ itemName: 'Tofu', price: 2.1, storeId: 'Hua Ho' },
{ itemName: 'Soymilk', price: 3.0, storeId: 'SKH' },
{ itemName: 'Toothpaste', price: 3.0, storeId: 'Supasave' },
{ itemName: 'Toothbrush', price: 2.2, storeId: 'Soon Lee' },
{ itemName: 'Shampoo', price: 4.3, storeId: 'Hua Ho' },
{ itemName: 'Conditioner', price: 4.5, storeId: 'SKH' },
{ itemName: 'Soap', price: 1.6, storeId: 'Supasave' },
{ itemName: 'Lotion', price: 3.8, storeId: 'Soon Lee' },
{ itemName: 'Razor', price: 2.9, storeId: 'Hua Ho' },
{ itemName: 'Deodorant', price: 3.5, storeId: 'SKH' },
{ itemName: 'Towel', price: 6.4, storeId: 'Supasave' },
{ itemName: 'Sponge', price: 1.5, storeId: 'Soon Lee' },
{ itemName: 'Plate', price: 2.4, storeId: 'Hua Ho' },
{ itemName: 'Cup', price: 1.8, storeId: 'SKH' },
{ itemName: 'Fork', price: 1.0, storeId: 'Supasave' },
{ itemName: 'Knife', price: 1.3, storeId: 'Soon Lee' },
{ itemName: 'Spoon', price: 1.0, storeId: 'Hua Ho' },
{ itemName: 'Pan', price: 8.9, storeId: 'SKH' },
{ itemName: 'Pot', price: 9.5, storeId: 'Supasave' },
{ itemName: 'Mug', price: 2.6, storeId: 'Soon Lee' },
{ itemName: 'Bowl', price: 1.9, storeId: 'Hua Ho' },
{ itemName: 'Mat', price: 3.1, storeId: 'SKH' },
{ itemName: 'Blanket', price: 12.0, storeId: 'Supasave' },
{ itemName: 'Pillow', price: 8.3, storeId: 'Soon Lee' },
{ itemName: 'Curtain', price: 15.2, storeId: 'Hua Ho' },
{ itemName: 'Mirror', price: 10.5, storeId: 'SKH' },
{ itemName: 'Lamp', price: 9.8, storeId: 'Supasave' },
{ itemName: 'Clock', price: 6.6, storeId: 'Soon Lee' },
{ itemName: 'Fan', price: 25.0, storeId: 'Hua Ho' },
{ itemName: 'Iron', price: 29.5, storeId: 'SKH' },
{ itemName: 'Kettle', price: 19.8, storeId: 'Supasave' },
{ itemName: 'Blender', price: 35.4, storeId: 'Soon Lee' },
{ itemName: 'Phone', price: 499.9, storeId: 'Hua Ho' },
{ itemName: 'Tablet', price: 799.0, storeId: 'SKH' },
{ itemName: 'Laptop', price: 1200.0, storeId: 'Supasave' },
{ itemName: 'Mouse', price: 15.9, storeId: 'Soon Lee' },
{ itemName: 'Keyboard', price: 29.0, storeId: 'Hua Ho' },
{ itemName: 'Monitor', price: 280.0, storeId: 'SKH' },
{ itemName: 'Printer', price: 199.0, storeId: 'Supasave' },
{ itemName: 'Cable', price: 5.5, storeId: 'Soon Lee' },
{ itemName: 'Speaker', price: 85.0, storeId: 'Hua Ho' },
{ itemName: 'Camera', price: 350.0, storeId: 'SKH' },
{ itemName: 'Tripod', price: 45.0, storeId: 'Supasave' },
{ itemName: 'Router', price: 65.0, storeId: 'Soon Lee' },
{ itemName: 'Charger', price: 18.0, storeId: 'Hua Ho' },
{ itemName: 'Powerbank', price: 39.0, storeId: 'SKH' },
{ itemName: 'Headphone', price: 59.0, storeId: 'Supasave' },
{ itemName: 'Microphone', price: 89.0, storeId: 'Soon Lee' },
{ itemName: 'Pen', price: 1.2, storeId: 'Hua Ho' },
{ itemName: 'Pencil', price: 0.9, storeId: 'SKH' },
{ itemName: 'Notebook', price: 2.5, storeId: 'Supasave' },
{ itemName: 'Eraser', price: 0.5, storeId: 'Soon Lee' },
{ itemName: 'Marker', price: 1.8, storeId: 'Hua Ho' },
{ itemName: 'Glue', price: 1.3, storeId: 'SKH' },
{ itemName: 'Tape', price: 1.0, storeId: 'Supasave' },
{ itemName: 'Paper', price: 5.0, storeId: 'Soon Lee' },
{ itemName: 'Book', price: 12.0, storeId: 'Hua Ho' },
{ itemName: 'Magazine', price: 6.0, storeId: 'SKH' },
{ itemName: 'Newspaper', price: 1.2, storeId: 'Supasave' },
{ itemName: 'Toy', price: 8.9, storeId: 'Soon Lee' },
{ itemName: 'Ball', price: 5.5, storeId: 'Hua Ho' },
{ itemName: 'Racket', price: 25.0, storeId: 'SKH' },
{ itemName: 'Glove', price: 9.8, storeId: 'Supasave' },
{ itemName: 'Shoe', price: 45.0, storeId: 'Soon Lee' },
{ itemName: 'Sock', price: 3.2, storeId: 'Hua Ho' },
{ itemName: 'Hat', price: 7.4, storeId: 'SKH' },
{ itemName: 'Belt', price: 8.0, storeId: 'Supasave' },
{ itemName: 'Watch', price: 120.0, storeId: 'Soon Lee' },
{ itemName: 'Bag', price: 35.0, storeId: 'Hua Ho' },
{ itemName: 'Wallet', price: 25.0, storeId: 'SKH' },
{ itemName: 'Ring', price: 150.0, storeId: 'Supasave' },
{ itemName: 'Necklace', price: 200.0, storeId: 'Soon Lee' },
{ itemName: 'Bracelet', price: 90.0, storeId: 'Hua Ho' },
{ itemName: 'Perfume', price: 75.0, storeId: 'SKH' },
{ itemName: 'Candle', price: 5.0, storeId: 'Supasave' },
{ itemName: 'Battery', price: 3.4, storeId: 'Soon Lee' },
{ itemName: 'Light', price: 6.5, storeId: 'Hua Ho' },
{ itemName: 'Wire', price: 4.3, storeId: 'SKH' },
{ itemName: 'Nail', price: 2.0, storeId: 'Supasave' },
{ itemName: 'Hammer', price: 10.0, storeId: 'Soon Lee' },
{ itemName: 'Screwdriver', price: 8.2, storeId: 'Hua Ho' },
{ itemName: 'Wrench', price: 11.5, storeId: 'SKH' },
{ itemName: 'Drill', price: 59.9, storeId: 'Supasave' },
{ itemName: 'Paint', price: 18.0, storeId: 'Soon Lee' },
{ itemName: 'Brush', price: 2.9, storeId: 'Hua Ho' },
{ itemName: 'Mask', price: 1.5, storeId: 'SKH' },
{ itemName: 'Sanitizer', price: 3.2, storeId: 'Supasave' },
{ itemName: 'Glasses', price: 89.0, storeId: 'Soon Lee' },
{ itemName: 'Bottle', price: 2.5, storeId: 'Hua Ho' },
{ itemName: 'Can', price: 1.6, storeId: 'SKH' },
{ itemName: 'Jar', price: 2.0, storeId: 'Supasave' },
{ itemName: 'Biscuit', price: 2.3, storeId: 'Soon Lee' }
];

async function addDummyStores() {
  for (const store of dummyStores) {
    await db.collection('prices').add(store);
    console.log(`Added item: ${store.itemName}`);
  }
  console.log('Dummy data insertion complete.');
  process.exit(0);
}

addDummyStores().catch((err) => {
  console.error('Error adding dummy data:', err);
  process.exit(1);
});
