const express = require('express');
const LectureService = require('../services/lectureService');
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

module.exports = {lectureRouter}