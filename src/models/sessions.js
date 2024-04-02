const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const _ = require('lodash')
const session = require('../constants/session.constant')
const Schema = mongoose.Schema(
{
  userId: {
    type: ObjectId,
    require: true,
  },
  expiredAt: {
    type: Date,
    require: true,
  },
  status: {
    type: String,
    enum: _.values(session.STATUS_TOKEN),
  },
  logoutAt: {
    type: Date,
  },
},
	{
		collection: 'sessions',
		versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model(Schema.options.collection, Schema);
