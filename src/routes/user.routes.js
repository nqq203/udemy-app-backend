const express = require('express');
const userRouter = express.Router();

const UserService = require('../services/userService');
const service = new UserService();

userRouter.post('/create', async (req, res) => {
  // const data = req.body;

  //Temp data
  const userData = {
    email: 'abc123@gmail.com',
    fullname: 'Tran Minh Anh',
    password: '123456',
  }
  const response = await service.createUser(userData);
  res.send(response.responseBody());
});

userRouter.get('/email', async (req, res) => {
  // const data = req.body;

  //Temp data
  const email = 'tranminhanh1912@gmail.com';
  const response = await service.getUserByEmail(email);
  res.send(response.responseBody());
});

userRouter.get('/list', async (req, res) => {
  const response = await service.getAllUsers();
  res.send(response.responseBody());
});

module.exports = { userRouter };