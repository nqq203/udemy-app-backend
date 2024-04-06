const Course = require("../models/courses");
module.exports = class CourseRepository {
    constructor(){
        this.model = Course
    }

    async getCourseById(id){
        try {
            const course = await this.model.findOne({ _id: id });
            return course
        } catch (error) {
            return null
        }
    }

}