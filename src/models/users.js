const mongoose = require("mongoose");
const { USER_ROLE, USER_GENDER } = require("../constants/user.constants");

const Schema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    fullName: { type: String, required: true },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    biography: { type: String },
    website: { type: String },
    facebook: { type: String },
    linkedin: { type: String},
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
