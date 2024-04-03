const express = require('express');
const OrderService = require('../services/orderService');
const service = new OrderService();
const orderRouter = express.Router();

//Testing 
String.prototype.toObjectId = function() {
  var ObjectId = (require('mongoose').Types.ObjectId);
  return new ObjectId(this.toString());
};

orderRouter.post('/create', async (req, res) => {
  const orderData = {
    userId: '6600f3eb54ceadb10ad3e4e8'.toObjectId(),
    courseId: '6603e745d8569ec90a5568aa'.toObjectId(),
    country: req.body.country,
    price: req.body.totalPrice,
    paymentMethod: req.body.paymentMethod,
  }
  const response = await service.createOrder(orderData);
  res.send(response.responseBody());
});

orderRouter.get('/order-by-user', async (req, res) => {
  //Testing data
  const orderData = {
    userId: '6600f3eb54ceadb10ad3e4e8'.toObjectId(),
  }
  const response = await service.getOrderByUser(orderData);
  res.send(response.responseBody());
});

orderRouter.get('/list', async (req, res) => {
  const response = await service.getAllOrders();
  res.send(response.responseBody());
});

module.exports = { orderRouter };