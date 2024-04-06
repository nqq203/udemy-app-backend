const express = require('express')
const CourseService = require('../services/courseService');
const service = new CourseService();
const courseRouter = express.Router();

courseRouter.get('/list',async (req,res) => {
    const response = await service.getAllCourses();
    res.send(response.responseBody());
});

courseRouter.get('/ratings',async(req,res) => {
    const ratings = req.query.rating || 0;
    const response = await service.getCoursesByRating(ratings);
    res.send(response.responseBody());
});

courseRouter.get('/course-learning', async(req,res) => {
    const id = req.query.courseId;
    const response = await service.getCourseById(id);
    res.send(response.responseBody());
})

courseRouter.get('/', async(req,res) => {
    const pageNumber = req.query.pageNum || 1;
    const pageSize = req.query.pageSize || 3;    
    const response = await service.getCoursePagination(pageNumber,pageSize);
    res.send(response.responseBody());
})

courseRouter.get('/search-courses-ratings',async(req,res) => {
    const keyword = req.query.keyword || ""
    const pageNumber = req.query.p || 1;
    const filterRating = req.query.rating || 0;
    const response = await service.getCoursesBySearch(keyword,pageNumber,filterRating);
    
    res.send(response.responseBody());
})

module.exports = {courseRouter};