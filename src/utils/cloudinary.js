const express = require('express');
const app = express();
const cloudinaryModule = require('cloudinary');
const cloudinary = cloudinaryModule.v2;
// const fs = require('fs');
cloudinary.config({
    cloud_name: 'dkzc50ok0',
    api_key: '236915934187757',
    api_secret: 'VzrTTuK9gRKt7hZZQ-YF7XutsTs',
});
const multer = require('multer');

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = file.fieldname + '-' + uniqueSuffix + file.originalname;
        cb(null, filename);
    },
});

async function uploadFileToCloud(file) {
    try {
        // Sửa đổi ở đây: thêm .upload sau cloudinary.uploader
        const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "video",
        });
        return result.secure_url; // Đảm bảo trả về secure_url từ result
    }
    catch (error) {
        console.error(error);
        throw error; // Thêm throw để xử lý lỗi ở cấp cao hơn nếu cần
    }
}

const uploads = multer({ storage });

module.exports = { cloudinary, uploads, uploadFileToCloud };
