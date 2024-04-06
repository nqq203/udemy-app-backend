const Course = require("../models/courses") 
const {paginate} = require('../utils/pagination');

module.exports = class CourseRepository{
    constructor(){
        this.model = Course;
    }

    async getAll(){
        try {
            const allCourses = await this.model.find();
            return allCourses;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getOneByEntity(entity){
        try {
            const course = await this.model.findOne(entity);
            return course;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getAllByEntity(entity){
        try {
            const courses = await this.model.find(entity);
            return courses;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getCoursebyId(id){
        try {
            const course = await this.model.findById(id);
            return course;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getCoursePagination(pageNumber,PAGE_SIZE=3, query = {}){
        return paginate(this.model,pageNumber, PAGE_SIZE, query);
    }

    async getAllByCourseName(name) {
        try {
            const courses = await this.model.find({ name: { $regex: name } });
            return {courses};
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    

};
