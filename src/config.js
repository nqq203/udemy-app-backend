const config = {
  databaseURL: 'mongodb://127.0.0.1:27017/testdatabase',
  port: 8080,
  jwtSecret: process.env.JWT_SECRET,
};

module.exports = config;