const LectureRepository = require('../repositories/lectureRepository');
const {
    SuccessResponse,
} = require("../common/success.response");

const {
    NotFoundResponse,
    InternalServerError,
} = require("../common/error.response");

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
}