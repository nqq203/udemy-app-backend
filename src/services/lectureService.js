const LectureRepository = require('../repositories/lectureRepository');
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

module.exports = class LectureService{
    constructor(){
        this.repository = new LectureRepository();
    }

    async getLecturesBySectionId(sectionId){
        try {
            const lectures = await this.repository.getAllByEntity({sectionId});
            if(!lectures || lectures.length == 0){
                return new NotFoundResponse("Lectures not found");
            }

            return new SuccessResponse({message: "Lectures found", metadata: lectures});
        } catch (error) {
            console.log(err);
            return new InternalServerError();
        }
    }

    async getDuration(sectionId){
        try {
            const sectionDuration = await this.repository.getSectionDuration({sectionId});
            if(!sectionDuration){
                return new NotFoundResponse("Duration not had");
            }

            return new SuccessResponse({message: "Duration calculated", metadata: {sectionDuration}});
        } catch (error) {
            console.log(err);
            return new InternalServerError();
        }
    }

    async createOneLecture(data) {
      try {
        const { title, sectiondId, url, duration } = data;
        if (!title || !url) {
          return new BadRequest("Please provide title and url");
        }
        const newLecture = await this.repository.create(data);
        return new CreatedResponse({
          message: "Create lecture successfully",
          metadata: newLecture,
        });
      } catch (error) {
        return new InternalServerError();
      }
    }

    async updateOneLecture(data) {
      try {
        const { _id, title, url, duration } = data;
        const updatedData = { title, url, duration };
        const updatedLecture = await this.repository.update({_id}, updatedData);
        if (!updatedLecture) {
          return new NotFoundResponse("Lecture not found");
        }
        return new SuccessResponse({
          message: "Lecture updated successfully",
          metadata: updatedLecture,
        });
      }
      catch (err) {
        return new InternalServerError();
      }
    }

    async deleteOneLecture(lectureId) {
      try {
        const deletedLecture = await this.repository.delete(lectureId);
        if (!deletedLecture) {
          return new NotFoundResponse("Lecture not found");
        }
        return new SuccessResponse({
          message: "Lecture deleted successfully",
          metadata: deletedLecture,
        });
      } catch(error) {
        console.log(error);
        return new InternalServerError();
      }
    }

    async deleteLecturesBySectionId(sectionId) {
      try {
        const result = await this.repository.deleteMany({sectionId: sectionId});
        return new SuccessResponse({
          message: "lectures deleted successfully",
          metadata: result,
        })  
      }
      catch (err) {
        console.log(err);
        return new InternalServerError();
      }
    }
} 