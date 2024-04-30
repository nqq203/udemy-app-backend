const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const Schema = new mongoose.Schema(
    {
        courseId: { type: ObjectId },
        userId: { type: ObjectId },
        content: { type: String }
    },
    {
        collection: "notes",
        versionKey: false,
        timestamps: true,
    }
)

module.exports = mongoose.model(Schema.options.collection, Schema);