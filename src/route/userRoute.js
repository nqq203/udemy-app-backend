const express = require('express');
const { signup } = require('../controller/userController');
// const { authenticateToken } = require('./middleware');
const userRouter = express.Router();

userRouter.post('/signup', signup);

module.exports = { userRouter };