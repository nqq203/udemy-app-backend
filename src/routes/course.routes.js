const express = require('express');
const CourseService = require('../services/courseService');
const service = new CourseService();
const {verifyToken, checkRoles} = require('../middlewares/authorization');
const asyncHandler = require('../middlewares/asyncHandler');
const courseRouter = express.Router();
const { USER_ROLE } = require('../constants/user.constants');
const { uploads } = require('../utils/cloudinary');

String.prototype.toObjectId = function() {
  var ObjectId = (require('mongoose').Types.ObjectId);
  return new ObjectId(this.toString());
};

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

courseRouter.get('/get-course', verifyToken, async (req, res) => {
  const data = req.query.courseId.toObjectId();
  const response = await service.getCourseById(data);
  res.send(response.responseBody());
});

courseRouter.get('/get-user-courses', verifyToken, async (req, res) => {
  const data = req.query;
  if (data.courses === undefined) {
    return res.send({message: 'Please provide courses'});
  }
  const courses = data.courses.courses.map(course => course.toObjectId())
  const response = await service.getUserCourses(courses);
  console.log(response.responseBody());
  res.send(response.responseBody());
});

courseRouter.post('/search', verifyToken, checkRoles([USER_ROLE.PROVIDER]), async (req, res) => {
  const data = req.body;
  const response = await service.getCourseByName(data);
  res.send(response.responseBody());
});

courseRouter.get('/list', verifyToken, checkRoles([USER_ROLE.PROVIDER]), async (req, res) => {
  const response = await service.getAllCourses();
  res.send(response.responseBody());
});

courseRouter.put('/update-course', verifyToken, checkRoles([USER_ROLE.PROVIDER]), async (req, res) => {
  const courseData = req.body;
  const response = await service.updateCourse(courseData);
  res.send(response.responseBody());
});

courseRouter.post('/create-completed-course', verifyToken, uploads.array('lectureVideos'), async (req, res) => {
  const courseData = JSON.parse(req.body.courseData);
  const sections = JSON.parse(req.body.sections);
  const filesData = req.files;
  const response = await service.createCourseWithSectionsAndLectures({courseData, sections}, filesData);
  res.send(response.responseBody());
});

module.exports = { courseRouter };