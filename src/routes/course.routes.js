const express = require('express');
const CourseService = require('../services/courseService');
const service = new CourseService();
const courseRouter = express.Router();

const { verifyToken, checkRoles } = require('../middlewares/authorization');
const asyncHandler = require('../middlewares/asyncHandler');
const { USER_ROLE } = require('../constants/user.constants');
const { uploads } = require('../utils/cloudinary');

courseRouter.get('/list', async (req, res) => {
  const response = await service.getAllCourses();
  res.send(response.responseBody());
});

courseRouter.get('/ratings', async (req, res) => {
  const ratings = req.query.rating || 0;
  const response = await service.getCoursesByRating(ratings);
  res.send(response.responseBody());
});

courseRouter.get('/course-learning', verifyToken, checkRoles([USER_ROLE.LEARNER]), async (req, res) => {
  const id = req.query.courseId;
  const response = await service.getCourseById(id);
  res.send(response.responseBody());
})

courseRouter.get('/', async (req, res) => {
  const pageNumber = req.query.pageNum || 1;
  const pageSize = req.query.pageSize || 3;
  const response = await service.getCoursePagination(pageNumber, pageSize);
  res.send(response.responseBody());
})

courseRouter.get('/search-courses-ratings', async (req, res) => {
  const keyword = req.query.keyword || ""
  const pageNumber = req.query.p || 1;
  const filterRating = req.query.rating || 0;
  const response = await service.getCoursesBySearch(keyword, pageNumber, filterRating);

  res.send(response.responseBody());
})

courseRouter.post('/create-one-course', verifyToken, uploads.single('imageFile'), async (req, res) => {
  const courseData = JSON.parse(req.body.courseData);
  const imageFile = req.file;
  const response = await service.createCourse(courseData, imageFile);

  res.send(response.responseBody());
});

courseRouter.post('/list-course', verifyToken, async (req, res) => {
  const data = req.body;
  // console.log(data);
  const response = await service.getAllCoursesByUserId(data.instructorId);

  res.send(response.responseBody());
});

courseRouter.post('/search', verifyToken, async (req, res) => {
  const data = req.body;
  const response = await service.getCourseByName(data);

  res.send(response.responseBody());
});

courseRouter.post('/create-completed-course', verifyToken, uploads.array('files'), async (req, res) => {
  const courseData = JSON.parse(req.body.courseData);
  const sections = JSON.parse(req.body.sections);
  const filesData = req.files;
  const response = await service.createCourseWithSectionsAndLectures({ courseData, sections }, filesData);

  res.send(response.responseBody());
});

courseRouter.put('/update-course', verifyToken, uploads.single('imageFile'), async (req, res) => {
  const courseData = JSON.parse(req.body.courseData);
  const imageFile = req.file;
  // console.log(courseData);
  const response = await service.updateCourse(courseData, imageFile);

  res.send(response.responseBody());
});

courseRouter.delete("/delete-course/:courseId", verifyToken, async (req, res) => {
  const { courseId } = req.params;
  const response = await service.deleteCourse(courseId);

  res.send(response.responseBody());
});

courseRouter.post("/get-course-detail", verifyToken, async (req, res) => {
  const data = req.body;
  // console.log(data);
  const response = await service.getInstructorDetailCourse(data.courseId);

  res.send(response.responseBody());
});

module.exports = { courseRouter };
