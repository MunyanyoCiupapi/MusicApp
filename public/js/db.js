// db.js
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = `mongodb+srv://chmylkomarcin:${process.env.DB_PASS}@cluster.uvi44.mongodb.net/?retryWrites=true&w=majority&appName=Cluster`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectToMongo() {
  try {
    await client.connect();
    db = client.db("musicstore"); 
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

function getDb() {
  return db;
}

module.exports = { connectToMongo, getDb };
