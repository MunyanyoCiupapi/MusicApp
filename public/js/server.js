const express = require('express');
const bcrypt = require('bcrypt');
const { connectToMongo, getDb } = require('./db'); 
const session = require('express-session');
const validator = require('validator');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session setup
app.use(session({
  secret:'supersecret1234',  
  resave: false,
  saveUninitialized: true,
}));


connectToMongo().then(() => {
  const db = getDb(); 


  app.get('/message', (req, res) => {
    res.json({ message: 'Hello from the Marcin!' });
  });

  app.get('/users', async (req, res) => {
    try {
      const users = await db.collection('users').find().toArray();
      res.json(users);
    } catch (err) {
      res.status(500).send("Error fetching users: " + err);
    }
  });

  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  app.post('/register', async (req, res) => {
      const {username, email, password} = req.body;

      if (!username || !email || !password) {
        return res.status(400).send("All fields are required.");
      }

      const existinguser = await db.collection('user').findOne({email})
      if (existinguser) {
        return res.status(400).send("User already exists.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      try {
        await db.collection('users').insertOne({ username, email, password: hashedPassword });
        res.status(201).send("User created successfully!");
      } catch (err) {
        res.status(500).send("Error creating user: " + err);
      }
  })

}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});
