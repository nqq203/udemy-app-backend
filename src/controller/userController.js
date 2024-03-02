const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

const loginUser = (req, res) => {
  const user = { id: user.id, username: user.username };
  const token = jwt.sign(user, jwtSecret, { expiresIn: '24h' }); 
  
  res.status(200).json({ token });
};