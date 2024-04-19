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

    async getAllByEntity(entity){
        try {
            const review = await this.model.find(entity);
            return review;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}