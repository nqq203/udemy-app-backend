const express = require('express');
const { createNewAccount } = require('../controller/userController');
// const { authenticateToken } = require('./middleware');
const userRouter = express.Router();

userRouter.post('/signup', createNewAccount);

module.exports = { userRouter };