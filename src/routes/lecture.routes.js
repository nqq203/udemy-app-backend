const express = require('express');
const LectureService = require('../services/lectureService');
const {verifyToken, checkRoles} = require('../middlewares/authorization');
const asyncHandler = require('../middlewares/asyncHandler');
const lectureRouter = express.Router();
const service = new LectureService();

lectureRouter.post('/create', verifyToken, verifyToken, async (req, res) => {
  const data = req.body;
  const response = await service.createOneLecture(data);
  res.send(response.responseBody());
});

lectureRouter.get('/:sectionId', async (req, res) => {
  const sectionId = req.params.sectionId;
  const response = await service.getLecturesBySectionId(sectionId);
  //console.log(response);
  res.send(response.responseBody());
})

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