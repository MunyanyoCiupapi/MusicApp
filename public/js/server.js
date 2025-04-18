const express = require('express');
const bcrypt = require('bcrypt');
const { connectToMongo, getDb } = require('./db'); 
const session = require('express-session');
const validator = require('validator');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'supersecret1234',
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
      res.status(500).json({ message: "Error fetching users: " + err });
    }
  });

  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

  app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      const existingUser = await db.collection('users').findOne({
        $or: [{ username }, { email }]
      });

      if (existingUser) {
        return res.status(400).json({ message: "User with this username or email already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await db.collection('users').insertOne({ username, email, password: hashedPassword });

      res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
      res.status(500).json({ message: "Error creating user: " + err });
    }
  });

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      const user = await db.collection('users').findOne({
        $or: [{ username }, { email: username }]
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid username or password." });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid username or password." });
      }

      req.session.userId = user._id;
      req.session.username = user.username;

      res.status(200).json({ message: "Login successful!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error logging in: " + err });
    }
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});
