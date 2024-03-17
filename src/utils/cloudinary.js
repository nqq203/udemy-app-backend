const express = require('express');
const app = express();
const cloudinaryModule = require('cloudinary');
const cloudinary = cloudinaryModule.v2;
// const fs = require('fs');
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
const multer = require('multer');

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = file.fieldname + '-' + uniqueSuffix + file.originalname;
        cb(null, filename);
    },
});

const uploads = multer({ storage });

module.exports = { cloudinary, uploads };
