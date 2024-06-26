const express = require("express");
const CartService = require("../services/cartService");
const service = new CartService();
const { verifyToken, checkRoles } = require("../middlewares/authorization");
const { SuccessResponse } = require("../common/success.response");
const cartRouter = express.Router();

cartRouter.get("/", verifyToken, async (req, res) => {
  const { user } = req;
  const response = await service.getCart(user._id);
  res.send(response.responseBody());
});

cartRouter.post("/", verifyToken, async (req, res) => {
  const { courseId = "" } = req.body;
  const { user } = req;
  const response = await service.createCart({ userId: user._id, itemId: courseId });
  res.send(response.responseBody());
});


cartRouter.delete("/:itemId", verifyToken, async (req, res) => {
  const { user } = req;
  const { itemId = "" } = req.params;
  const response = await service.deleteCart({userId: user._id, itemId});
  res.send(response.responseBody());
});

cartRouter.get("/all", verifyToken, async (req, res) => {
  const { userId } = req.query;
  const response = await service.getAllCart(userId);
  res.send(response.responseBody());
});

cartRouter.delete("/", verifyToken, async (req, res) => {
  const { userId } = req.query;
  const response = await service.deleteAllCart(userId);
  res.send(response.responseBody());
});

module.exports = { cartRouter };