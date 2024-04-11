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
  const { id = "" } = req.body;
  const { user } = req;
  const response = await service.createCart({ userId: user._id, itemId: id });
  res.send(response.responseBody());
});
module.exports = { cartRouter };