const mongoose = require("mongoose");
const { USER_ROLE,USER_GENDER } = require("../constants/user.constants");

const Schema = new mongoose.Schema(
  {
    courseId: { type: mongoose.ObjectId, required: true },
    name: { type: String, required: true },
  },
  {
    collection: "sections",
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model(Schema.options.collection, Schema);
