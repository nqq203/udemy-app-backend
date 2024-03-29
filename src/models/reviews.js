const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const Schema = new mongoose.Schema(
    {
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        userId: { type: ObjectId, required: true },
        courseId: { type: String, required: true },
    },
    {
        collection: "reviews",
        versionKey: false,
        timestamps: true,
    }
)

module.exports = mongoose.model(Schema.options.collection, Schema)