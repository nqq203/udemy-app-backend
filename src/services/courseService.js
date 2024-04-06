const CourseRepository = require("../repositories/courseRepository")
const SectionRepository = require("../repositories/sectionRepository")
const LectureRepository = require("../repositories/lectureRepository")
const UserRepository = require("../repositories/userRepository")

const {
    SuccessResponse,
} = require("../common/success.response");

const {
    NotFoundResponse,
    InternalServerError,
} = require("../common/error.response");

module.exports = class CourseService{
    constructor() {
        this.courseRepo = new CourseRepository();
        this.sectionRepo = new SectionRepository();
        this.lectureRepo = new LectureRepository();
        this.userRepo = new UserRepository();
    }

    async getAllCourses() {
        try {
            const courses = await this.courseRepo.getAll();
            if(!courses || courses.length == 0){
                return new NotFoundResponse("Courses not found")
            } 
            return new SuccessResponse({message: "Courses found", metadata: courses});
        } catch (error) {
            console.log(error);
            return new InternalServerError();
        }
    }

    async getCoursesByRating(ratings){
        try {
            const courses = await this.courseRepo.getAllByEntity({ratings});
            if(!courses || courses.length == 0){
                return new NotFoundResponse(`Courses with ${ratings} ratings not found`)
            }
            return new SuccessResponse({message: `Courses with ${ratings} ratings found`, metadata: courses});
        } catch (error) {
            console.log(error);
            return new InternalServerError();
        }
    }

    // Get all information of the course including sections,lectures and instructor
    async getCourseById(_id){
        try {
            const course = await this.courseRepo.getCoursebyId({_id});
            let courseId = _id
            const sections = await this.sectionRepo.getAllByEntity({courseId})
            var lectures = []
            
            var _id = course.instructorId
            var instructor = await this.userRepo.getByEntity({_id})            

            if (!sections || sections.length === 0) {
                // Handle the case where sections is undefined or empty
                return new NotFoundResponse("Sections not found");
            }

            if (!instructor || instructor.length === 0) {
                // Handle the case where instructor is undefined or empty
                return new NotFoundResponse("instructor not found");
            }

            // sections.forEach(async (section) => {
            //     let sectionId = section._id;
            //     const lecturesList = await this.lectureRepo.getAllByEntity({ sectionId });
            //     console.log(lecturesList)
            //     lectures.push(lecturesList)
            // })

            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                let sectionId = section._id;
                const lecturesList = await this.lectureRepo.getAllByEntity({ sectionId });
                lectures.push(lecturesList)
            }

              
            if(!course){
                return new NotFoundResponse("Course not found");
            }
            return new SuccessResponse({message: "Course found",metadata: {course,instructor,sections,lectures}});
        } catch (error) {
            console.log(error);
            return new InternalServerError();
        }
    }

    async getCoursePagination(pageNumber,PAGE_SIZE=3, query = {}){
        try {
            const courses = await this.courseRepo.getCoursePagination(pageNumber,PAGE_SIZE, query);
            if(!courses || courses.length == 0){
                return new NotFoundResponse("Courses pagination not found")
            }
            
            var instructors = []
            await Promise.all(courses?.results.map(async (course) => {
                const _id = course.instructorId;
                const instructor = await this.userRepo.getByEntity(_id);
                instructors.push(instructor.fullName);
            }));
            courses.instructors = instructors

            return new SuccessResponse({message: "Courses pagination found",metadata: courses});
        } catch (error) {
            console.log(error);
            return new InternalServerError();
        }
    }

    async getCoursesBySearch(keyword,pageNumber,rating=0){
        try {
            const PAGE_SIZE=10
            if (!keyword) {
              return new BadRequest("Keywords id are required");
            }

            const regex = new RegExp(keyword, 'i');
            var query;
            if(rating == 0){
                // no filter rating
                query = { name: { $regex: regex } }
            } else{
                // filter rating
                query = { 
                    name: { $regex: regex } , 
                    $or: [{"ratings": rating},{"ratings": { $gt: rating}}]
                };
            }
            
            const data = await this.courseRepo.getCoursePagination(pageNumber,PAGE_SIZE,query)

            if (!data) {
              return new NotFoundResponse("No data to show");
            }
            
            var instructors = []
            var durationList = []
            await Promise.all(data?.results.map(async (course) => {
                const _id = course.instructorId;
                const instructor = await this.userRepo.getByEntity(_id);
                instructors.push(instructor.fullName);


                let courseId = course._id
                let courseDuration = 0
                const sections = await this.sectionRepo.getAllByEntity({courseId});
                await Promise.all(sections.map(async section => {
                    let sectionId = section._id
                    let duration = await this.lectureRepo.getSectionDuration({sectionId});
                    courseDuration += duration
                }))
                durationList.push(courseDuration)                
            }));
            data.instructors = instructors
            data.durationList = durationList
            
            return new SuccessResponse({message: "Course(s) found",metadata: data});
        } catch (error) {
            console.log(error);
            return new InternalServerError();
        }
    }
}