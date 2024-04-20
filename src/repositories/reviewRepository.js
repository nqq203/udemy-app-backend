const Review = require('../models/reviews');

module.exports = class ReviewRepository{
    constructor(){
        this.model = Review;
    }

    async create(data){
        try {
            const newReview = new Review(data);
            await newReview.save();
            return newReview;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getReviewsByCourseId(courseId){
        try {
            const reviews = await this.model.find({courseId});
            return reviews;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async update(filter, entity) {
        try {
          const review = await this.model.findOneAndUpdate(filter, entity);
          return review;
        } catch (error) {
          console.error(error);
          return null;
        }
    }

    async getByUserAndCourseId(courseId,userId){
        try {
            console.log(courseId)
          const review = await this.model.findOne({
            courseId: courseId,
            userId: userId,
          })
          return review;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getReviewsPagination(courseId){

    }

}