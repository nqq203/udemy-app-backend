const express = require("express");
// const session = require("express-session");
// const MongoStore = require('connect-mongo');
const Router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./configs/db");
const app = express();
const routes = require('./routes/index');
// const passport = require('./configs/passport.config');
const port = 8080;
require('dotenv').config();
db.connectDB();

app.use(
  cors({
    origin: "http://localhost:3030",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
  })
);

app.use(bodyParser.json());

// Configure express-session
// app.use(session({
//   secret: 'MYSECRETKEY', // This should be a random, secret string for your application
//   resave: true,
//   saveUninitialized: false, // typically, setting this to false is more secure
//   cookie: {
//     secure: false, // true if you are serving your site over HTTPS
//     maxAge: 0
//   },
//   store: MongoStore.create({
//     mongoUrl: process.env.MONGODB_URI, // Or use your MongoDB connection string directly
//     collectionName: 'sessions'
//   })
// }));

// app.use(passport.initialize());
// app.use(passport.session());

Router(app);
// app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on port ${port}: http://localhost:${port}`);
});
