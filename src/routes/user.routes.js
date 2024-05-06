const express = require('express');
const UserService = require('../services/userService');
const service = new UserService();
const { verifyToken, checkRoles } = require('../middlewares/authorization');
const asyncHandler = require('../middlewares/asyncHandler');
const userRouter = express.Router();
const passport = require('../configs/passport.config');
require('dotenv').config();
const { uploads } = require('../utils/cloudinary');
const {
  CreatedResponse,
  SuccessResponse,
} = require("../common/success.response");

String.prototype.toObjectId = function() {
  var ObjectId = (require('mongoose').Types.ObjectId);
  return new ObjectId(this.toString());
};

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
  if (data.typeLogin !== 'normal') {
    req.logout((err) => { // Thêm hàm callback vào đây
      if (err) {
        res.send({
          success: true,
          code: 500,
          message: "Error logging out"
        }); // Xử lý lỗi nếu có
      }
      res.send(response.responseBody());
    });
  }
  else {
    res.send(response.responseBody());
  }
});

userRouter.get('/email', verifyToken, checkRoles(['LEARNER']), async (req, res) => {
  const { email = '' } = req.query;
  if (!email) { 
    return res.send(new BadRequest("Missed email").responseBody());
  } 
  const response = await service.getUserByEmail(email);
  res.send(response.responseBody());
});

userRouter.get('/id', verifyToken, async (req, res) => {
  const id = req.query.id;
  const response = await service.getUserById(id);
  res.send(response.responseBody());
});

userRouter.patch('/change-password', verifyToken, async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  const response = await service.handlePasswordChange(email, currentPassword, newPassword);
  res.send(response.responseBody());
});

userRouter.patch('/update-profile', verifyToken, async (req, res) => {
  const data = req.body;
  const response = await service.updateProfile(data);
  res.send(response.responseBody());
});

userRouter.put('/change-avatar', verifyToken, uploads.single('image'), async (req, res) => {
  const imageFile = req?.file?.path;
  const { email } = req.body;
  console.log(imageFile, email)
  const response = await service.updateAvatar(email, imageFile);
  console.log(response.responseBody())
  res.send(response.responseBody());
});



userRouter.get('/list', async (req, res) => {
  const response = await service.getAllUsers();
  res.send(response.responseBody());
});

userRouter.post('/signin', async (req, res) => {
  const data = req.body;
  const response = await service.signIn(data);
  if (response instanceof SuccessResponse) {
    res.set('Authorization', `Bearer ${response.payload.metadata.accessToken}`);
  }
 
  res.send(response.responseBody())
});

userRouter.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email']})
);

userRouter.get('/google/redirect', 
  passport.authenticate('google', { failureRedirect: '/sign-in' }),
  async (req, res) => {
    const data = req.session.passport.user;
    const response = await service.signInWithOauth(data);
    const responseData = response.responseBody();
    const userInfo = JSON.stringify(responseData.metadata.userInfo);
    const accessToken = JSON.stringify(responseData.metadata.accessToken);
    res.redirect(`${process.env.URL_FE}/oauth2/?userInfo=${userInfo}&accessToken=${accessToken}`);
  }
);

userRouter.get('/facebook', 
  passport.authenticate('facebook', { scope: ['profile', 'email'] })
);

userRouter.get('/facebook/redirect',
  passport.authenticate('facebook', { failureRedirect: '/sign-in'}),
  async (req, res) => {
    const data = req.session.passport.user;
    const response = await service.signInWithOauth(data);
    const responseData = response.responseBody();
    const userInfo = JSON.stringify(responseData.metadata.userInfo);
    const accessToken = JSON.stringify(responseData.metadata.accessToken);
    res.redirect(`${process.env.URL_FE}/oauth2/?userInfo=${userInfo}&accessToken=${accessToken}`);
  }
);

userRouter.get('/activate-account/:activationToken', async (req, res) => {
  const response = await service.activateAccount(req.params.activationToken);
  console.log=(response);
  res.send(response.responseBody());
});

userRouter.post('/forgot-password', async (req, res) => {
  const data = req.body;
  const response = await service.forgotPassword(data.email);
  res.send(response.responseBody());
});

userRouter.get('/check-token/:token', async (req, res) => {
  const { token } = req.params;
  const response = await service.checkToken(token);
  res.send(response.responseBody());
});
userRouter.put('/reset-password/:token', async (req, res) => {
  const data = req.body;
  const { password} = data;
  const { token } = req.params;
  const response = await service.resetPassword(token, password);
  res.send(response.responseBody());
});

userRouter.get('/:id/wishlist', verifyToken, async (req, res) => {
  const { id: userId } = req.params;
  const response = await service.getWishlist(userId);
  console.log(response)
  res.send(response.responseBody());
});

userRouter.put('/:id/wishlist', verifyToken, async (req, res) => {
  const { id: userId } = req.params;
  const courseId = req.body.courseId;
  const response = await service.removeWishlistItem(userId, courseId);
  console.log(response);

  res.send(response.responseBody());
});

userRouter.post('/:id/wishlist', verifyToken, async (req, res) => {
  const { id: userId } = req.params;
  const courseId = req.body.courseId;
  const response = await service.addWishlistItem(userId, courseId);
  res.send(response.responseBody());
});

module.exports = { userRouter };