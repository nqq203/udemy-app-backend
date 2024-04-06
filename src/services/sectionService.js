const SectionRepository = require('../repositories/sectionRepository');
const {
    InternalServerError,
    NotFoundResponse,
} = require("../common/error.response");
const {
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
}

