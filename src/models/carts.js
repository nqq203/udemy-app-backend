const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const Schema = new mongoose.Schema(
  {
    userId: { type: ObjectId, required: true },
    itemId: {
        type: ObjectId,
        required: true
    },
  },
  {
    collection: "carts",
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model(Schema.options.collection, Schema);