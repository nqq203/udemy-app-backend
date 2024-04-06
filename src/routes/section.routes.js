const express = require('express');
const SectionService = require('../services/sectionService');
const service = new SectionService();
const sectionRouter = express.Router();

sectionRouter.get('/', async(req,res) => {
    const courseId = req.query.id;
    const response = await service.getSectionsByCourseId(courseId);
    res.send(response.responseBody())
})

module.exports = {sectionRouter};