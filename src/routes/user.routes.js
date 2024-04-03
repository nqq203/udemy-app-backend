const express = require('express');
// const { createNewAccount } = require('../controller/userController');
const UserService = require('../services/userService');
const service = new UserService();
const {verifyToken, checkRoles} = require('../middlewares/authorization');
const asyncHandler = require('../middlewares/asyncHandler');
const userRouter = express.Router();


userRouter.post('/create', async (req, res) => {
  // const userData = {
  //   fullName: "Tran Minh Anh",
  //   email: "tranminhanh1912@gmail.com",
  //   password: "Udemy123!",
  // }

  const userData = req.body;
  const response = await service.createUser(userData);

  res.send(response.responseBody());
});
userRouter.post('/login', async(req,res)=>{
  const data = req.body;
  const response = await service.signIn(data);

  res.send(response.responseBody())
})

userRouter.post('/logout', verifyToken, async (req, res) => {
  const data = req.body;
  const response = await service.signOut(data);
  res.send(response.responseBody());
});

userRouter.get('/email', verifyToken,async (req, res) => {
  const {email = ''} = req.body;
  if (!email) {
    return res.send(new BadRequest("Missed email").responseBody());
  } 
  const response = await service.getUserByEmail(email);
  res.send(response.responseBody());
});

userRouter.post('/change-password', verifyToken, async (req, res) => {
  //Test data
  const email = "abc123@gmail.com";
  const newPassword = "Udemy12345!";
  const response = await service.handlePasswordChange(email, newPassword);
  res.send(response.responseBody());
});

userRouter.post('/update-profile', verifyToken, async (req, res) => {
  //Test data
  const data = {
    fullName: "Tran Minh Anh",
    email: "tranminhanh1912@gmail.com",
  }
  const response = await service.updateProfile(data);
  res.send(response.responseBody());
});

userRouter.get('/list', async (req, res) => {
  const response = await service.getAllUsers();
  res.send(response.responseBody());
});

module.exports = { userRouter };