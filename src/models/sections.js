const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const { USER_ROLE,USER_GENDER } = require("../constants/user.constants");
const Schema = new mongoose.Schema(
  {
    _id: { type: ObjectId, auto: true },
    courseId: { type: ObjectId, required: true },
    name: { type: String, required: true },
  },
  {
    collection: "sections",
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model(Schema.options.collection, Schema);
