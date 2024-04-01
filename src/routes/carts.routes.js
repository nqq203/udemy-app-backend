const express = require('express');
const CartService = require('../services/cartService');
const service = new CartService();
const {verifyToken, checkRoles} = require('../middlewares/authorization');
const userRouter = express.Router();


userRouter.get('/', verifyToken, async (req,res) =>{
  const {id = ''} = req.body;
  const response = await service.getCart(id);
  res.send(response.responseBody())
})