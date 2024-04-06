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

    async create(data) {
      try {
        const newLecture = new Lecture(data);
        console.log(newLecture);
        await newLecture.save();
        return newLecture;
      } catch (error) {
        console.error(error);
        return null;
      }
    }

    async getByEntity(entity) {
      try {
        const lecture = await this.model.findOne(entity);
        return lecture;
      } catch (error) {
        console.error(error);
        return null;
      }
    }

    async getAll() {
      try {
        const lectures = await this.model.find();
        return lectures;
      } catch (error) {
        console.error(error);
        return null;
      }
    }

    async update(filter, entity) {
      try {
        const lecture = await this.model.findOneAndUpdate(filter, entity);
        return lecture;
      } catch (error) {
        console.error(error);
        return null;
      }
    }

    async delete(entity) {
      try {
        const lecture = await this.model.findOneAndDelete(entity);
        return lecture;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
};
