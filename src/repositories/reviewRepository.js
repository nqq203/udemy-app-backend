const Review = require('../models/reviews');
const {paginate} = require('../utils/pagination');


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

    async getReviewsPagination(pageNumber,PAGE_SIZE=10, query = {},sort){
        try {
            const skip = (pageNumber - 1) * PAGE_SIZE;
            const totalDocs = await this.model.countDocuments(query);
            const totalPages = Math.ceil(totalDocs / PAGE_SIZE);
    
            var results;
            const sortType = parseInt(sort) || 0;
            if(sortType === 1){ //Oldest first
                results = await this.model.find(query).sort({createdAt: 1,}).skip(skip).limit(PAGE_SIZE);
            } else if(sortType === -1){ // Newest first
                results = await this.model.find(query).sort({createdAt: -1,}).skip(skip).limit(PAGE_SIZE);
            } else{
                results = await this.model.find(query).skip(skip).limit(PAGE_SIZE);
            }
    
            const pageSize = results.length || 0;
    
            return { results, page: pageNumber, pageSize: pageSize, totalPages, totalDocs };            
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