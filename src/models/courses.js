const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const { COURSE_CATEGORY } = require("../constants/course.constant");
const Schema = new mongoose.Schema(
  {
    name: {
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
    instructorId: { type: ObjectId, required: true },
    ratings: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String,
      default: "https://via.placeholder.com/300x300.png?text=Course+Image",
    },
  },
  {
    collection: "courses",
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model(Schema.options.collection, Schema);