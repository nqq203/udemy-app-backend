const ReviewRepository = require("../repositories/reviewRepository");
const CourseRepository = require("../repositories/courseRepository");
const UserRepository = require("../repositories/userRepository")


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
    this.courseRepo = new CourseRepository();
    this.userRepo = new UserRepository();
  }

  async getReviewsByCourseId(courseId) {
    try {
      const reviews = await this.repository.getReviewsByCourseId(courseId);
      if (!reviews) {
        return new NotFoundResponse("Review not found");
      }

      var users = []
      for (let i = 0; i < reviews.length; i++) {
        const _id = reviews[i]?.userId;
        const user = await this.userRepo.getByEntity({ _id });
        users.push(user.fullName)
      }
      // console.log(users)


      return new SuccessResponse({ message: "Review found", metadata: {reviews,users} });
    } catch (err) {
      console.log(err);
      return new InternalServerError();
    }
  }

  async getReviewByUserAndCourseId(courseId,userId) {
    try {
      const review = await this.repository.getByUserAndCourseId(courseId,userId);
      if (!review) {
        return new NotFoundResponse("Review not found");
      }

      return new SuccessResponse({ message: "Review found", metadata: {review} });
    } catch (err) {
      console.log(err);
      return new InternalServerError();
    }
  }

  async getReviewsPagination(courseId,ratings,pageNumber,sort){
    try {
      const review = await this.repository.getReviewsByCourseId(courseId);
      if (!review) {
        return new NotFoundResponse("Review not found");
      }

      var query;
      const PAGE_SIZE=10
      if(ratings > 0){
        query = {
          courseId : courseId,
          rating: ratings,
        }
      } else{
        query = {
          courseId: courseId,
        }
      }

      const data = await this.repository.getReviewsPagination(pageNumber,PAGE_SIZE,query,sort);
      if (!data) {
        return new NotFoundResponse("No data to show");
      }
      var users = []
      for (let i = 0; i < data?.results?.length; i++) {
        const _id = data?.results[i]?.userId;
        const user = await this.userRepo.getByEntity({ _id });
        users.push(user.fullName)
      }
      data.users = users


      return new SuccessResponse({message: "Course(s) found",metadata: data});
    } catch (error) {
      console.log(error);
      return new InternalServerError();
    }
  }

  async createReview(data){
    try {
      const {rating,comment,userId,courseId} = data
      if(!userId || !courseId){
        return new BadRequest("Missed information");
      }

      const review = await this.repository.create({
        rating: rating,
        comment: comment,
        userId: userId,
        courseId: courseId,
      });

      if (!review) {
        return new BadRequest("Create review failed");
      }

      // update total ratings of course
      const updatedResult = this.updateAvgRatings(courseId)

      return new CreatedResponse({
        message: "Create review successfully",
        metadata: review,
      });

    } catch (error) {
      console.log(err);
      return new InternalServerError();
    }
  }

  async updateAvgRatings(courseId){
    try {
      const reviews = await this.repository.getReviewsByCourseId(courseId);
      if (!reviews) {
        return new NotFoundResponse("Review not found");
      }

      var totalRating = 0
      var avgRating = 0
      if(reviews.length != 0){
        reviews.forEach(review => {
          totalRating += review.rating;
        })
        avgRating = (totalRating/reviews.length).toFixed(1)
      }

      const _id = courseId
      const updatedCourse = await this.courseRepo.updateOne({_id},{$set: { "ratings" : avgRating}})
      if (!updatedCourse || updatedCourse.modifiedCount === 0) {
        return new NotFoundResponse("Course not found");
      }
  
      return new CreatedResponse({
        message: "Update course ratings",
        metadata: updatedCourse,
      });

    } catch (error) {
      console.log(error);
      return new InternalServerError();
    }
  }

  // not finished
  async updateReview(data){
    try {
      const {_id,rating,comment,userId,courseId} = data;
      if(!_id){
        return new BadRequest("Review ID is required for updating");
      }

      const updateEntity = {rating,comment,userId,courseId};

      const updatedReview = await this.repository.update({_id},updateEntity)
      if (!updatedReview) {
        return new NotFoundResponse("Review not found");
      }
      const newResponse = {
        ...updatedReview._doc,
        rating: rating,
        comment: comment,
        userId: userId,
        courseId: courseId
      }
      return new SuccessResponse({
        message: "Review updated successfully",
        metadata: newResponse,
      });
    
    } catch (error) {
      console.log(error);
      return new InternalServerError();
    }
  }
};
