
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const { COURSE_CATEGORY } = require("../constants/course.constant");
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
  },
  {
    collection: "carts",
    versionKey: false,
    timestamps: true,
  }
);