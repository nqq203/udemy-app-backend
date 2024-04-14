const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const Schema = new mongoose.Schema(
    {
        title: { type: String, required: true, minLength: 2, maxLength: 255 },
        url: { type: String, required: true },
        sectionId: { type: mongoose.ObjectId, required: true },
        duration: { type: BigInt, required: true },
    },
    {
        collection: "lectures",
        versionKey: false,
        timestamps: true,
    }
)

module.exports = mongoose.model(Schema.options.collection, Schema);