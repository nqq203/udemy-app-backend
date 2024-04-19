const mongoose = require("mongoose");
const ObjectId = require('mongodb').ObjectId;
const { ORDER_STATUS, PAYMENT_METHOD } = require("../constants/order.constant.js");
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
    country: { type: String },
    status: { type: String, enum: Object.values(ORDER_STATUS) },
    paymentMethod: { type: String, enum: Object.values(PAYMENT_METHOD) },
    paymentId: { type: String },
  },
  {
    collection: "orders",
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model(Schema.options.collection, Schema)