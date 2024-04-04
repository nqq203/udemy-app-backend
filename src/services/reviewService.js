const ReviewRepository = require("../repositories/reviewRepository");

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

module.exports = class ReviewService {
  constructor() {
    this.repository = new ReviewRepository();
  }

  async getReviewsByCourseId(courseId) {
    try {
      const reviews = await this.repository.getReviewsByCourseId(courseId);
      if (!reviews) {
        return new NotFoundResponse("Review not found");
      }
      return new SuccessResponse({ message: "Review found", metadata: reviews });
    } catch (err) {
      console.log(err);
      return new InternalServerError();
    }
  }
};
