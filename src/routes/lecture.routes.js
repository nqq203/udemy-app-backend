const express = require('express');
const LectureService = require('../services/lectureService');
const {verifyToken, checkRoles} = require('../middlewares/authorization');
const asyncHandler = require('../middlewares/asyncHandler');
const { uploads } = require('../utils/cloudinary');
const service = new LectureService();
const lectureRouter = express.Router();

lectureRouter.get('/', async(req,res) => {
    const sectionId = req.query.sectionId;
    const response = await service.getLecturesBySectionId(sectionId);
    res.send(response.responseBody());
})

lectureRouter.get('/duration', async(req,res) => {
    const sectionId = req.query.sectionId;
    const response = await service.getDuration(sectionId);
    res.send(response.responseBody());
})

lectureRouter.post('/create', uploads.single("videoFile"), async (req, res) => {
  const lectureData = JSON.parse(req.body.lectureData);
  const videoFile = req.file;
  console.log(videoFile);
  const response = await service.createOneLecture(lectureData, videoFile);
  res.send(response.responseBody());
});

lectureRouter.put('/update-lecture', uploads.single("videoFile"), async (req, res) => {
  const lectureData = JSON.parse(req.body.lectureData);
  const videoFile = req.file;
  const response = await service.updateOneLecture(lectureData, videoFile);

  res.send(response.responseBody());
});

lectureRouter.delete('/delete-lecture/:lectureId', async (req, res) => {
  const { lectureId } = req.params;
  console.log(lectureId);
  const response = await service.deleteOneLecture(lectureId);

  res.send(response.responseBody());
});

module.exports = { lectureRouter };
