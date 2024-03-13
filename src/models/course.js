const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 255,
    },
    description: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 512,
    },
    price: { type: Number, required: true },
    category: { type: String, enum: Object.values(COURSE_CATEGORY) },
    providerId: { type: String, required: true },
  },
  {
    collection: "courses",
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model(Schema.options.collection, Schema);