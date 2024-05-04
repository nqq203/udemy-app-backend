const express = require("express");
const CourseService = require("../services/courseService");
const service = new CourseService();
const courseRouter = express.Router();

const {
  verifyToken,
  checkRoles,
  checkCourseAccess,
} = require("../middlewares/authorization");
const asyncHandler = require("../middlewares/asyncHandler");
const { USER_ROLE } = require("../constants/user.constants");
const { uploads } = require("../utils/cloudinary");
const courses = require("../models/courses");

String.prototype.toObjectId = function () {
  var ObjectId = require("mongoose").Types.ObjectId;
  return new ObjectId(this.toString());
};

<<<<<<< Updated upstream
=======
function checkimageFileUpload(req, res, next) {
  if (!req.file) {
    // Nếu không có file, gọi next() để bỏ qua multer
    return next();
  }
  // Nếu có file, sử dụng multer để xử lý file
  uploads.single('imageFile')(req, res, next);
}

function checkArrayFileUpload(req, res, next) {
  if (!req.file) {
    // Nếu không có file, gọi next() để bỏ qua multer
    return next();
  }
  // Nếu có file, sử dụng multer để xử lý file
  uploads.array("files")(req, res, next);
}


>>>>>>> Stashed changes
courseRouter.get("/list", async (req, res) => {
  const response = await service.getAllCourses();
  res.send(response.responseBody());
});

courseRouter.get("/ratings", async (req, res) => {
  const ratings = req.query.rating || 0;
  const response = await service.getCoursesByRating(ratings);
  res.send(response.responseBody());
});

courseRouter.get(
  "/course-learning",
  verifyToken,
  checkCourseAccess,
  async (req, res) => {
    const id = req.query.courseId;
    const response = await service.getCourseById(id);
    res.send(response.responseBody());
  }
);

courseRouter.get("/course-by-id", async (req, res) => {
  const id = req.query.courseId?.toObjectId();
  const response = await service.getCourseByCId(id);
  res.send(response.responseBody());
});

courseRouter.get("/", async (req, res) => {
  const pageNumber = req.query.pageNum || 1;
  const pageSize = req.query.pageSize || 3;
  const response = await service.getCoursePagination(pageNumber, pageSize);
  res.send(response.responseBody());
});

// Route: /view-list-courses?keyword=${keyword}&p=${1}&rating=${rating}
// Route: /view-list-courses?category=${category}&p=${1}&rating=${rating}
courseRouter.get("/search-courses-ratings", async (req, res) => {
  const keyword = req.query.keyword || "";
  const category = req.query.category || "";
  const pageNumber = req.query.p || 1;
  const filterRating = req.query.rating || 0;
  const response = await service.getCoursesBySearch(
    category,
    keyword,
    pageNumber,
    filterRating
  );

  res.send(response.responseBody());
});

courseRouter.post(
  "/create-one-course",
  verifyToken,
  checkimageFileUpload,
  async (req, res) => {
    const courseData = JSON.parse(req.body.courseData);
    const imageFile = req.file;
    const response = await service.createCourse(courseData, imageFile);

    res.send(response.responseBody());
  }
);

courseRouter.post("/list-course", verifyToken, async (req, res) => {
  const data = req.body;
  const response = await service.getAllCoursesByUserId(data.instructorId);
  res.send(response.responseBody());
});

courseRouter.get("/get-course", verifyToken, async (req, res) => {
  const data = req.query.courseId.toObjectId();
  const response = await service.getCourseById(data);
  res.send(response.responseBody());
});

courseRouter.get("/get-user-courses", verifyToken, async (req, res) => {
  const data = req.query;
  if (data.courses === undefined) {
    return res.send({ message: "Please provide courses" });
  }
  const courses = Object.values(data.courses.courses);
  const courseData = courses.map((course) => course.toObjectId());
  const response = await service.getUserCourses(courseData);
  res.send(response.responseBody());
});

courseRouter.get("/get-cart-courses", verifyToken, async (req, res) => {
  const { courses } = req.query;
  if (courses === undefined || courses.length === 0) {
    return res.send({ message: "Please provide courses" });
  }
  const courseData = courses.map((course) => course.toObjectId());
  const response = await service.getUserCourses(courseData);
  res.send(response.responseBody());
});

courseRouter.post("/search", verifyToken, async (req, res) => {
  const data = req.body;
  const response = await service.getCourseByName(data);

  res.send(response.responseBody());
});

courseRouter.post(
  "/create-completed-course",
  verifyToken,
  checkArrayFileUpload,
  async (req, res) => {
    const courseData = JSON.parse(req.body.courseData);
    const sections = JSON.parse(req.body.sections);
    const filesData = req.files;
    const response = await service.createCourseWithSectionsAndLectures(
      { courseData, sections },
      filesData
    );

    res.send(response.responseBody());
  }
);

courseRouter.put(
  "/update-course",
  verifyToken,
  checkimageFileUpload,
  async (req, res) => {
    const courseData = JSON.parse(req.body.courseData);
    const imageFile = req.file;
    // console.log(courseData);
    const response = await service.updateCourse(courseData, imageFile);

    res.send(response.responseBody());
  }
);

courseRouter.delete(
  "/delete-course/:courseId",
  verifyToken,
  async (req, res) => {
    const { courseId } = req.params;
    const response = await service.deleteCourse(courseId);

    res.send(response.responseBody());
  }
);

courseRouter.post("/get-course-detail", verifyToken, async (req, res) => {
  const data = req.body;
  // console.log(data);
  const response = await service.getInstructorDetailCourse(data.courseId);

  res.send(response.responseBody());
});

// API for getting course detail by course id
courseRouter.get("/:id/related", async (req, res) => {
  const courseId = req.params.id;
  const response = await service.getRelatedCourses(courseId);

  res.send(response.responseBody());
});

courseRouter.get("/:id", async (req, res) => {
  const courseId = req.params.id;
  const response = await service.getCourseById(courseId);

  res.send(response.responseBody());
});



module.exports = { courseRouter };
