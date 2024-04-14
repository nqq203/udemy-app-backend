const Course = require('../models/courses');

module.exports = class CourseRepository {
  constructor() {
    this.model = Course;
  }

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

  async getAll() {
    try {
      const courses = await this.model.find();
      return courses;
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
  
  async getCourseById(id) {
    try {
      const course = await this.model.findOne({ _id: id });
      return course
    } catch (error) {
      return null
    }
  }

}
