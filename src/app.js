const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
// const { databaseURL, port } = require('./config');
const db = require('./configs/db');
const app = express();
const routes = require('./routes/index');
// const logger = require('./helpers/logger');
const port = 3030
require('dotenv').config();
// logger.setTransport();
db.connectDB();

// mongoose.connect(databaseURL, { useNewUrlParser: true, useUnifiedTopology: true})
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Could not connect to MongoDB...', err));
// console.log(databaseURL);
app.use(cors({
  origin: 'http://localhost:3030'
}));

app.use(bodyParser.json());
app.use('/api', routes.userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});