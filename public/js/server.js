const express = require('express');
const bcrypt = require('bcrypt');
const { connectToMongo, getDb } = require('./db'); 
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(session({
  secret: 'supersecret1234',
  resave: false,
  saveUninitialized: true,
}));

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});
const upload = multer({ storage: storage });



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


  app.post('/upload', upload.single('audio'), async (req, res) => {
    const { title, price } = req.body;
    const file = req.file;
  
    if (!title || !price || !file) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    if (!req.session.userId) {
      return res.status(401).json({ message: 'You must be logged in to upload.' });
    }
  
    try {
      const beat = {
        title,
        price: parseFloat(price),
        audioPath: file.path,
        uploadedAt: new Date(),
        ownerId: req.session.userId 
      };
  
      const result = await db.collection('beats').insertOne(beat);
  
      res.status(201).json({
        message: 'Beat uploaded successfully.',
        beat: { ...beat, _id: result.insertedId }
      });
    } catch (err) {
      res.status(500).json({ message: 'Failed to upload beat.', error: err.message });
    }
  });
  
  app.delete('/delete/:id', async (req, res) => {
    const beatId = req.params.id;
  
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
  
    try {
      const beat = await db.collection('beats').findOne({ _id: new ObjectId(beatId) });
  
      if (!beat) {
        return res.status(404).json({ message: 'Beat not found.' });
      }
  
      if (beat.ownerId !== req.session.userId) {
        return res.status(403).json({ message: 'You are not the owner of this beat.' });
      }
  
      // Delete beat
      await db.collection('beats').deleteOne({ _id: new ObjectId(beatId) });
  
      // Optionally delete file
      fs.unlink(beat.audioPath, err => {
        if (err) console.error('Error deleting file:', err);
      });
  
      res.status(200).json({ message: 'Beat deleted successfully.' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete beat.', error: err.message });
    }
  });



  app.get('/beats', async (req, res) => {
    try {
      const beats = await db.collection('beats').find().toArray();
      res.status(200).json(beats);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch beats.' });
    }
  });
  

  app.get('/me', (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not logged in' });
    }
  
    res.json({
      userId: req.session.userId,
      username: req.session.username
    });
  });
  
  
  

  

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});
