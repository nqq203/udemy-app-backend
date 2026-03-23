const LectureRepository = require('../repositories/lectureRepository');
const SectionRepository = require('../repositories/sectionRepository');
const {
  BadRequest,
  InternalServerError,
  NotFoundResponse,
} = require("../common/error.response");
const {
  CreatedResponse,
  SuccessResponse,
} = require("../common/success.response");
const { uploadFileToCloud } = require('../utils/cloudinary');
const { getVideoDurationInSeconds } = require('get-video-duration');

module.exports = class LectureService {
  constructor() {
    this.repository = new LectureRepository();
    this.sectionRepo = new SectionRepository();
  }

  async getLecturesBySectionId(sectionId) {
    try {
      const lectures = await this.repository.getAllByEntity({ sectionId });
      if (!lectures || lectures.length === 0) {
        return new NotFoundResponse("Lectures not found");
      }

      return new SuccessResponse({
        message: "Lectures found",
        metadata: lectures,
      });
    } catch (error) {
      console.log(error);
      return new InternalServerError();
    }
  }

  async getDuration(sectionId) {
    try {
      const sectionDuration = await this.repository.getSectionDuration({ sectionId });
      if (!sectionDuration) {
        return new NotFoundResponse("Duration not had");
      }

      return new SuccessResponse({
        message: "Duration calculated",
        metadata: { sectionDuration },
      });
    } catch (error) {
      console.log(error);
      return new InternalServerError();
    }
  }

  async createOneLecture(lectureData, videoFile) {
    try {
      const { title, sectionId } = lectureData;

      if (!title || !sectionId) {
        return new BadRequest("Missing information");
      }

      if (!videoFile || !videoFile.path) {
        return new BadRequest("Video file is required");
      }

      let lectureDuration;
      try {
        lectureDuration = await getVideoDurationInSeconds(videoFile.path);
      } catch (error) {
        console.log("Get local video duration failed:", error);
        return new BadRequest("Get video duration failed");
      }

      const fileUrl = await uploadFileToCloud(videoFile);

      if (!fileUrl) {
        return new BadRequest("Upload video failed");
      }

      const data = {
        title,
        sectionId,
        url: fileUrl,
        duration: BigInt(Math.floor(lectureDuration)),
      };

      const newLecture = await this.repository.create(data);

      return new CreatedResponse({
        message: "Create lecture successfully",
        metadata: newLecture,
      });
    } catch (error) {
      console.log(error);
      return new InternalServerError();
    }
  }

  async updateOneLecture(lectureData, videoFile) {
    try {
      const { _id, title, sectionId, url, duration } = lectureData;

      const updatedData = {
        title,
        url,
        duration,
        sectionId,
      };

      if (videoFile) {
        if (!videoFile.path) {
          return new BadRequest("Video file path is invalid");
        }

        let newDuration;
        try {
          newDuration = await getVideoDurationInSeconds(videoFile.path);
        } catch (error) {
          console.log("Get local video duration failed:", error);
          return new BadRequest("Get video duration failed");
        }

        const fileUrl = await uploadFileToCloud(videoFile);

        if (!fileUrl) {
          return new BadRequest("Upload video failed");
        }

        updatedData.url = fileUrl;
        updatedData.duration = BigInt(Math.floor(newDuration));
      }

      const updatedLecture = await this.repository.update({ _id }, updatedData);

      if (!updatedLecture) {
        return new NotFoundResponse("Lecture not found");
      }

      const newResponse = {
        ...updatedLecture._doc,
        title,
        url: updatedData.url,
        duration: updatedData.duration,
        sectionId,
      };

      return new SuccessResponse({
        message: "Lecture updated successfully",
        metadata: newResponse,
      });
    } catch (error) {
      console.log(error);
      return new InternalServerError();
    }
  }

  async deleteOneLecture(lectureId) {
    try {
      const deletedLecture = await this.repository.delete({ _id: lectureId });

      if (!deletedLecture) {
        return new NotFoundResponse("Lecture not found");
      }

      return new SuccessResponse({
        message: "Lecture deleted successfully",
        metadata: deletedLecture,
      });
    } catch (error) {
      console.log(error);
      return new InternalServerError();
    }
  }

  async deleteLecturesBySectionId(sectionId) {
    try {
      const result = await this.repository.deleteMany({ sectionId });

      return new SuccessResponse({
        message: "lectures deleted successfully",
        metadata: result,
      });
    } catch (error) {
      console.log(error);
      return new InternalServerError();
    }
  }
};