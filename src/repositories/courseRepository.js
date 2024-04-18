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
    
    // async getCourseById(id) {
    //   try {
    //     const course = await this.model.findOne({ _id: id });
    //     return course
    //   } catch (error) {
    //     return null
    //   }
    // }

    async create(data) {
        try {
          const newCourse = new Course(data);
          await newCourse.save();
          return newCourse;
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    
      async getByEntity(entity) {
        try {
          const course = await this.model.findOne(entity);
          return course;
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    
      async getAllByCourseName(name) {
        try {
          const courses = await this.model.find({ name: { $regex: name } });
          return courses;
        } catch (error) {
          console.error(error);
          return null;
        }
      }

      async getAllUserCourses(courses){
        try {
          const userCourses = await this.model.find({ _id: { $in: 
              courses
            } 
          });
          return userCourses;
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    
      async update(filter, entity) {
        try {
          const course = await this.model.findOneAndUpdate(filter, entity);
          return course;
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    
      async delete(entity) {
        try {
          const course = await this.model.findOneAndDelete(entity);
          return course;
        } catch (error) {
          console.error(error);
          return null;
        }
      }
};

