const express = require('express');
const { connectToMongo, getDb } = require('./db'); 
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));


connectToMongo().then(() => {
  const db = getDb();


  
  db.collection('users').insertOne({ name: 'John Doe', age: 30 })
    .then(() => {
      console.log('Inserted data into users collection');
    })

  app.get('/message', (req, res) => {
    res.json({ message: 'Hello from the Marcin!' });
  });


  
  app.get('/users', async (req, res) => {
    try {
      const users = await db.collection('users').find().toArray();
      res.json(users);
    } catch (err) {
      res.status(500).send("Error fetching users" + err);
    }
  });

  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
