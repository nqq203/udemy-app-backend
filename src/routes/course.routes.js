const express = require('express');

const CourseService = require('../services/courseService');
const service = new CourseService();
const courseRouter = express.Router();

courseRouter.get('/course/:id', async (req, res) => {
    const id = req.params.id;
    const response = await service.getCourseById(id);

    console.log(response);
    res.send(response.responseBody());
});

module.exports = { courseRouter };