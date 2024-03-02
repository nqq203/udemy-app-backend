const config = {
  databaseURL: 'mongodb://localhost:27017/MatchMingle',
  port: 8080,
  jwtSecret: process.env.JWT_SECRET,
};

module.exports = config;