const Course = require("../models/courses");

module.exports = class CourseRepository {
  constructor() {
    this.model = Course;
  }

  // Get course's by id
  async getCourseById(id) {
    try {
      const course = await this.model.findById(id);
      return course;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  // Get all courses
  async getAllCourses() {
    try {
      const allCourses = await this.model.find();
      return allCourses;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Get related courses by category
  async getRelatedCourses(category) {
    try {
      const relatedCourses = await this.model.find({ category });
      return relatedCourses;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
};
