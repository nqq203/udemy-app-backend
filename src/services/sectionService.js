const SectionRepository = require('../repositories/sectionRepository');
const CourseService = require('./courseService');
const LectureService = require('./lectureService');

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

module.exports = class SectionService{
  constructor() {
      this.repository = new SectionRepository();
  }

  async getSectionsByCourseId(courseId){
      try {
          const sections = await this.repository.getAllByEntity({courseId});
          if(!sections || sections.length == 0){
              return new NotFoundResponse("Sections not found");
          }
          return new SuccessResponse({message:"Sections found",metadata: sections});
      } catch (error) {
          console.log(error);
          return new InternalServerError();
      }
  }

  async createSection(data) {
    try {
      const { name, courseId } = data;
      if (!name) {
        return new BadRequest("Please provide title");
      }
      // const existCourse = await course.getCourseById(courseId);
      // console.log(existCourse);
      // if (!existCourse) {
      //   return new BadRequest("Course is not exist");
      // }
      const newSection = await this.repository.create(data);
      const response = await this.repository.getAllByEntity({courseId});
      console.log(response);
      return new CreatedResponse({
        message: "Section created successfully",
        metadata: response[response.length - 1]
      });
    } catch (error) {
      return new InternalServerError();
    }
  }

  async createListSection(data) {
    try {
      const { listSection } = data;
      // console.log(listSection);
      if (listSection.length === 0 || !listSection) {
        return new BadRequest("Require a list name of sections");
      }
      const newSections = await Promise.all(listSection.map(async (section) => {
        const newSection = await this.repository.create({ name: section.name, courseId: section.courseId });
        return newSection;
      }));
      return new CreatedResponse({
        message: "Create list of sectiosn successfully",
        metadata: newSections
      });
    }
    catch(error) {
      return new InternalServerError();
    } 
  }

  async getAllSections() {
    try {
      const listSection = await this.repository.getAll();
      if (!listSection) {
        return new NotFoundResponse("Empty list of sections");
      }
      return new SuccessResponse({
        message: "Select list sections successfully",
        metadata: listSection,
      });
    } catch (error) {
      return new InternalServerError();
    }
  }

  async updateSection(data) {
    try {
      const { _id, courseId, name } = data;
      const updatedData = { courseId, name };
      const updatedSection = await this.repository.update({_id}, updatedData);
      if (!updatedSection) {
        return new BadRequest("Section not found");
      }
      console.log("hello", updatedSection);
      const newResponse = {
        ...updatedSection._doc,
        name: name
      }
      return new SuccessResponse({
        message: "Section updated successfully",
        metadata: newResponse
      });
    }
    catch (error) {
      console.log(error);
      return new InternalServerError();
    }
  }

  async deleteSection(sectionId) {
    try {
      console.log(sectionId);
      const lectureService = new LectureService();
      await lectureService.deleteLecturesBySectionId(sectionId);
      const deletedSection = await this.repository.delete({_id: sectionId});
      if (!deletedSection) {
        return new NotFoundResponse("Section not found");
      }
      return new SuccessResponse({
        message: "Section deleted successfully",
        metadata: deletedSection,
      });
    } catch (error) {
      return new InternalServerError();
    }
  }
}
