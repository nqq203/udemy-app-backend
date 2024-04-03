const mongoose = require("mongoose");
const { ORDER_STATUS, PAYMENT_METHOD } = require("../constants/order.constant.js");
const { ObjectId } = mongoose.Schema;
const Schema = new mongoose.Schema(
  {
    userId: { type: ObjectId, required: true },
    items: {
      type: [
          {
              itemId: {
                  type: ObjectId,
                  required: true
              },
              price: {
                  type: Number,
                  required: true
              },
          },
      ],
      default: [],
      required: true,
  },
    status: { type: String, enum: Object.values(ORDER_STATUS) },
    paymentMethod: { type: String, enum: Object.values(PAYMENT_METHOD) },
  },
  {
    collection: "orders",
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model(Schema.options.collection, Schema)