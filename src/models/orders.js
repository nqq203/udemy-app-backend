const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: Object.values(ORDER_STATUS) },
    paymentMethod: { type: String, enum: Object.values(PAYMENT_METHOD) },
    paymentStatus: { type: String, enum: Object.values(PAYMENT_STATUS) },
  },
  {
    collection: "orders",
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model(Schema.options.collection, Schema)