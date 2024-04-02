const LectureRepsitory = require('../repositories/lectureRepository');

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

module.exports = class LectureService {
  constructor() {
    this.repository = new LectureRepsitory();
  }

  async createOneLecture(data) {
    try {
      const { title, sectiondId, url, duration } = data;
      if (!title || !url) {
        return new BadRequest("Please provide title and url");
      }
      const newLecture = await this.repository.create(data);
      return new CreatedResponse({
        message: "Create lecture successfully",
        metadata: newLecture,
      });
    } catch (error) {
      return new InternalServerError();
    }
  }
}