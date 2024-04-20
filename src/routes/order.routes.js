const express = require("express");
const OrderService = require("../services/orderService");
const { verifyToken } = require("../middlewares/authorization");
const { NotFoundResponse } = require("../common/error.response");
const service = new OrderService();
const orderRouter = express.Router();

String.prototype.toObjectId = function () {
  var ObjectId = require("mongoose").Types.ObjectId;
  return new ObjectId(this.toString());
};

orderRouter.post("/create", verifyToken, async (req, res) => {
  const items = req.body.items;
  items.forEach((item) => {
    item.itemId = item.itemId.toObjectId();
  });

  const orderData = {
    userId: req.body.userId.toObjectId(),
    items: items,
    country: req.body.country,
    price: req.body.totalPrice,
    paymentMethod: req.body.paymentMethod,
  };
  const response = await service.createOrder(orderData);
  res.send(response.responseBody());
});

orderRouter.get("/order-by-user", async (req, res) => {
  const orderData = req.query;
  if (orderData.userId === undefined) {
    res.send(new NotFoundResponse("Order Not Found"));
  } else {
    orderData.userId = orderData.userId.toObjectId();
    const response = await service.getOrderByUser(orderData);
    res.send(response.responseBody());
  }
});

orderRouter.get("/completed-orders", async (req, res) => {
  const { instructorId } = req.query;
  //console.log(instructorId)
  const response = await service.getCompletedOrdersByInstructorId(instructorId);
  res.send(response.responseBody());
});

orderRouter.get("/completed-orders-by-year", async (req, res) => {
  const { instructorId } = req.query;
  const response = await service.getCompletedOrdersByInstructorIdAndYear(
    instructorId,
    2024
  );
  res.send(response.responseBody());
});

orderRouter.get("/list", async (req, res) => {
  const response = await service.getAllOrders();
  res.send(response.responseBody());
});

module.exports = { orderRouter };
