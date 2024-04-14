const express = require('express');
const UserService = require('../services/userService');
const service = new UserService();
const { verifyToken, checkRoles } = require('../middlewares/authorization');
const asyncHandler = require('../middlewares/asyncHandler');
const userRouter = express.Router();
const {
  CreatedResponse,
  SuccessResponse,
} = require("../common/success.response");

userRouter.post('/signup', async (req, res) => {
  const userData = req.body;
  const response = await service.createUser(userData);

  res.send(response.responseBody());
});
userRouter.post('/signin', async (req, res) => {
  const data = req.body;
  // console.log(data)
  const response = await service.signIn(data);
  // console.log(response)
  if (response instanceof SuccessResponse) {
    res.set('Authorization', `Bearer ${response.payload.metadata.accessToken}`);
    // delete response.payload.metadata.accessToken;
  }

  res.send(response.responseBody())
})

userRouter.post('/logout', verifyToken, async (req, res) => {
  const data = req.body;
  const response = await service.signOut(data);
  res.send(response.responseBody());
});

userRouter.get('/email', verifyToken, checkRoles(['LEARNER']), async (req, res) => {
  const { email = '' } = req.body;
  if (!email) {
    return res.send(new BadRequest("Missed email").responseBody());
  } 
  const response = await service.getUserByEmail(email);
  res.send(response.responseBody());
});

userRouter.get('/id', verifyToken, async (req, res) => {
  const id = req.body._id;
  const response = await service.getUserById(id);
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