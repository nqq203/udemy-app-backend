const mongoose = require("mongoose");
const { USER_ROLE } = require("../constants/user.constants");

const Schema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    fullname: { type: String, required: true },
    password: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 18,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.LEARNER,
    },
    gender: {
      type: String,
      enum: Object.values(USER_GENDER),
    }
  },
  {
    collection: "users",
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model(Schema.options.collection, Schema);
