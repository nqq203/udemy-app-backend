const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { databaseURL, port } = require('./config');
console.log(databaseURL, port);
const app = express();

app.use(cors({
  origin: 'http://localhost:3030' 
}));

app.use(express.json());

mongoose.connect(databaseURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = {
  express
};