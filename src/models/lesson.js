const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
    {
        title: { type: String, required: true, minLength: 2, maxLength: 255 },
        videoUrl: { type: String, required: true },
        courseId: { type: String, required: true },
    },
    {
        collection: "lessons",
        versionKey: false,
        timestamps: true,
    }
)

module.exports = mongoose.model(Schema.options.collection, Schema);