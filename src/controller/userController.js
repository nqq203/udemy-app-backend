const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const { jwtSecret } = require('../config');
const User = require('../models/user');

exports.createNewAccount = async (req, res) => {
  try {
    const {fullname, email, password, role, gender} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const userExists = await User.findOne({email});
    console.log(userExists);
    if (userExists) return res.status(400).send('User already exists');

    const user = new User({fullname, email, password: hashedPassword, role, gender});
    console.log(user);
    await user.save();
    res.status(201).send('User created successfully');
  }
  catch (e) {
    res.status(500).send('Error signing up user');
  } 
} 