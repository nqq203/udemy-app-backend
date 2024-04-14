const express = require('express');
const LectureService = require('../services/lectureService');
const lecture = new LectureService();
const {verifyToken, checkRoles} = require('../middlewares/authorization');
const asyncHandler = require('../middlewares/asyncHandler');
const lectureRouter = express.Router();

lectureRouter.post('/create', verifyToken, verifyToken, async (req, res) => {
  const data = req.body;
  const response = await lecture.createOneLecture(data);
  res.send(response.responseBody());
});

// const service = new LectureService();
// const lectureRouter = express.Router();

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

module.exports = {lectureRouter}
