const express = require('express');
const CartService = require('../services/cartService');
const service = new CartService();
const {verifyToken, checkRoles} = require('../middlewares/authorization');
const cartRouter = express.Router();


cartRouter.get('/', verifyToken, async (req,res) =>{
  // const {id = ''} = req.body;
  const user = req.user;
  // console.log(user)
  const response = await service.getCart(user._id);
  res.send(response.responseBody())
})

cartRouter.post('/', verifyToken, async (req, res) => {
  const data = req.body;
  const user = req.user;
  data.userId = user._id
  const response = await service.createCart(data);
  res.send(response.responseBody());
})

cartRouter.delete('/', verifyToken, async (req, res) => {
  const data = req.body;
  const user = req.user;
  data.userId = user._id
  const response = await service.deleteCart(data);
  res.send(response.responseBody());
})
module.exports = { cartRouter };