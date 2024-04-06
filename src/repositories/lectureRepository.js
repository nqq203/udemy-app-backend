// import '../utils/polyfill'
const {toJSON} = require('../utils/polyfill');
const Lecture = require('../models/lectures');

module.exports = class LectureRepository{
    constructor(){
        this.model = Lecture;
    }

    async getAllByEntity(entity){
        try {
            const lectures = await this.model.find(entity);
            {lectures.map(lecture => {
                let duration = lecture.duration
                lecture.duration = duration.toJSON
            })}
            return lectures;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getSectionDuration(sectionId){
        try {
            let sectionDuration = 0;
            const lectures = await this.getAllByEntity(sectionId)
            {lectures.map(lecture => {
                let duration = parseInt(lecture.duration)
                sectionDuration += duration
            })}

            return sectionDuration;
        } catch (error) {
            console.error(error);
            return null;
        }

    }
}