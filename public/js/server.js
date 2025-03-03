const express = require('express');
const app = express();

const port = process.env.PORT || 3000;


app.use(express.json());
app.use(express.static('public'));


app.get('/message', (req, res) => {
    res.json({ message: 'Hello from the Marcin!' });
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

