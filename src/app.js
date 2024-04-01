const express = require('express');
const Router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./configs/db');
const app = express();
const routes = require('./routes/index');
const port = 8080
require('dotenv').config();
db.connectDB();

app.use(cors({
  origin: 'http://localhost:3030'
}));

app.use(bodyParser.json());
Router(app);
// app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on port ${port}: http://localhost:${port}`);
});