const LectureRepository = require('../repositories/lectureRepository');
const SectionRepository = require('../repositories/sectionRepository');
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
const { uploadFileToCloud } = require('../utils/cloudinary');
const { getVideoDurationInSeconds } = require('get-video-duration')

module.exports = class LectureService{
    constructor(){
        this.repository = new LectureRepository();
        this.sectionRepo = new SectionRepository();
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

    async createOneLecture(lectureData, videoFile) {
      try {
        const { title, sectionId } = lectureData;
        if (!title || !sectionId) {
          return new BadRequest("Missing information");
        }

        const fileUrl = await uploadFileToCloud(videoFile);

        let lectureDuration;
        await getVideoDurationInSeconds(
          fileUrl
        ).then((duration) => {
          lectureDuration = duration;
        })

        const data = {
          title,
          sectionId,
          url: fileUrl,
          duration: BigInt(parseInt(lectureDuration)),
        }

        const newLecture = await this.repository.create(data);
        console.log(newLecture);
        return new CreatedResponse({
          message: "Create lecture successfully",
          metadata: newLecture,
        });
      } catch (error) {
        return new InternalServerError();
      }
    }

    async updateOneLecture(lectureData, videoFile) {
      try {
        const { _id, title, sectionId, url, duration } = lectureData;
        const updatedData = { title, url, duration, sectionId };
        if (videoFile) {
          const fileUrl = await uploadFileToCloud(videoFile);
          console.log(fileUrl);
          updatedData.url = fileUrl;
          await getVideoDurationInSeconds(
            fileUrl
          ).then((duration) => {
            updatedData.duration = BigInt(parseInt(duration, 10));
          })
        }

        const updatedLecture = await this.repository.update({_id}, updatedData);
        if (!updatedLecture) {
          return new NotFoundResponse("Lecture not found");
        } 

        const newResponse = {
          ...updatedLecture._doc,
          title: title,
        }
        
        return new SuccessResponse({
          message: "Lecture updated successfully",
          metadata: newResponse,
        });
      }
      catch (err) {
        return new InternalServerError();
      }
    }

    async deleteOneLecture(lectureId) {
      try {
        console.log(lectureId);
        const deletedLecture = await this.repository.delete({_id: lectureId});
        console.log(deletedLecture);
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
