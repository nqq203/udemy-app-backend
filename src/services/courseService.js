const CourseRepository = require("../repositories/courseRepository");

const {
  ConflictResponse,
  BadRequest,
  InternalServerError,
  NotFoundResponse,
} = require("../common/error.response");
const {
  CreatedResponse,
  SuccessResponse,
} = require("../common/success.response");

module.exports = class CourseService {
  constructor() {
    this.repository = new CourseRepository();
  }

  async getCourseById(id) {
    try {
      const course = await this.repository.getCourseById(id);
      if (!course) {
        return new NotFoundResponse("Course not found");
      }
      return new SuccessResponse({ message: "Course found", metadata: course });
    } catch (err) {
      console.log(err);
      return new InternalServerError();
    }
  }
};
