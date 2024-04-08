const express = require('express')
const CourseService = require('../services/courseService');
const service = new CourseService();
const courseRouter = express.Router();

const {verifyToken, checkRoles} = require('../middlewares/authorization');
const asyncHandler = require('../middlewares/asyncHandler');
const { USER_ROLE } = require('../constants/user.constants');

courseRouter.get('/list',async (req,res) => {
    const response = await service.getAllCourses();
    res.send(response.responseBody());
});

courseRouter.get('/ratings',async(req,res) => {
    const ratings = req.query.rating || 0;
    const response = await service.getCoursesByRating(ratings);
    res.send(response.responseBody());
});

courseRouter.get('/course-learning', verifyToken, checkRoles(["LEARNER"]), async(req,res, next) => {
  try{
    // console.log("route")
    // console.log(req.header);
    const id = req.query.courseId;
    const response = await service.getCourseById(id);
    res.send(response.responseBody());
  } catch(error){
    console.log(error)
  }
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

courseRouter.post('/create', verifyToken, checkRoles([USER_ROLE.TEACHER]), async (req, res) => {
  const courseData = req.body;
  const response = await service.createCourse(courseData);

  res.send(response.responseBody());
});

// courseRouter.post('/list-course', verifyToken, checkRoles([USER_ROLE.TEACHER]), async (req, res) => {
//   const data = req.body;
//   const response = await service.getAllCoursesByUserId(data.instructorId);
  
//   res.send(response.responseBody());
// });

courseRouter.post('/list-course', async (req, res) => {
  const data = req.body;
  const response = await service.getAllCoursesByUserId(data.instructorId);
  
  res.send(response.responseBody());
});

courseRouter.post('/search', verifyToken, checkRoles([USER_ROLE.TEACHER]), async (req, res) => {
  const data = req.body;
  const response = await service.getCourseByName(data);

  res.send(response.responseBody());
});

courseRouter.get('/list', verifyToken, checkRoles([USER_ROLE.TEACHER]), async (req, res) => {
  const response = await service.getAllCourses();
  res.send(response.responseBody());
});

courseRouter.put('/update-course', verifyToken, checkRoles([USER_ROLE.TEACHER]), async (req, res) => {
  const courseData = req.body;
  const response = await service.updateCourse(courseData);

  res.send(response.responseBody());
});

courseRouter.post('/create-completed-course', verifyToken, checkRoles([USER_ROLE.TEACHER]), async (req, res) => {
  const courseData = req.body;
  const response = await service.createCourseWithSectionsAndLectures(courseData);

  res.send(response.responseBody());
});

module.exports = {courseRouter};