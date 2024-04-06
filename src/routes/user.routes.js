const express = require('express');
// const { createNewAccount } = require('../controller/userController');
const UserService = require('../services/userService');
const service = new UserService();
const {verifyToken, checkRoles} = require('../middlewares/authorization');
const asyncHandler = require('../middlewares/asyncHandler');
const userRouter = express.Router();


userRouter.post('/create', async (req, res) => {
  const userData = req.body;
  const response = await service.createUser(userData);

  res.send(response.responseBody());
});

userRouter.get('/email', verifyToken, async (req, res) => {
  const email = req.body.email;
  const response = await service.getUserByEmail(email);
  res.send(response.responseBody());
});

userRouter.get('/list', async (req, res) => {
  const response = await service.getAllUsers();
  res.send(response.responseBody());
});

module.exports = { userRouter };