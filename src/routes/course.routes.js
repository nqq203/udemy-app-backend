const express = require('express');

const CourseService = require('../services/courseService');
const service = new CourseService();
const courseRouter = express.Router();

courseRouter.get('/:courseid', async (req, res) => {
    const id = req.params.courseid;
    const response = await service.getCourseById(id);

    console.log(response);
    res.send(response.responseBody());
});

module.exports = { courseRouter };