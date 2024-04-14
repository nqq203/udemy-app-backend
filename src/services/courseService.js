const CourseRepository  = require("../repositories/courseRepository");
const UserService = require("../services/userService");
const SectionService = require("../services/sectionService");
const LectureService = require("../services/lectureService");
const {uploadFileToCloud} = require("../utils/cloudinary"); 
const SectionRepository = require("../repositories/sectionRepository")
const LectureRepository = require("../repositories/lectureRepository")
const UserRepository = require("../repositories/userRepository")

const {
  NotFoundResponse,
  BadRequest,
  InternalServerError,
} = require("../common/error.response");
const { 
  CreatedResponse,
  SuccessResponse,
} = require("../common/success.response");

module.exports = class CourseService {
  constructor() {
    this.repository = new CourseRepository();
    this.courseRepo = new CourseRepository();
        this.sectionRepo = new SectionRepository();
        this.lectureRepo = new LectureRepository();
        this.userRepo = new UserRepository();
  }

  async createCourse(data) {
    try {
      const { name, description, price, instructorId } = data;
      if (!name ||!description ||!price ||!instructorId) {
        throw new BadRequest("Please fill all the fields");
      }

      const user = new UserService();
      
      const existInstructor = await user.getUserById(instructorId);
      if (!existInstructor) {
        return new NotFoundResponse("Instructor not found");
      }
      const course = await this.repository.create(data);
      return new CreatedResponse({
        message: "Course created successfully",
        metadata: course,
      });
    } catch (error) {
      console.log(error);
      return new InternalServerError();
    }
  }

  async createCourseWithSectionsAndLectures(data, files) {
    try {
      const { courseData, sections } = data; // data in section include name and lectures
      //Create the course first
      const createdCourse = await this.createCourse(courseData);
      // console.log(createdCourse.payload.metadata);
        
      if (!sections || sections.length === 0) {
        return new BadRequest("Require at least one section");
      }

      const sectionService = new SectionService();
      const lectureService = new LectureService();

      let fileIndex = 0;

      // Iterate over each section
      for (const section of sections) {
        const { sectionData, lectures } = section; // sectionData includes name and lectures include list lecture
        if (!lectures || lectures.length === 0) {
          return new BadRequest("Each section must have at least one lecture");
        }

        // Add course Id to sectionData
        sectionData.courseId = createdCourse.payload.metadata._id;
        
        // Create the section
        const createdSection = await sectionService.createSection(sectionData);
        // console.log(createdSection.payload.metadata);

        // Iterate over lectures to create each one
        for (const lectureData of lectures) {
          if (fileIndex >= files.length) {
            return new BadRequest("Insufficient files uploaded for the lectures");
          }

          const file = files[fileIndex++];
          // console.log(file);
          const fileUrl = await uploadFileToCloud(file);
          // console.log(fileUrl);

          // Add sectionId and course Id to lectureData
          lectureData.sectionId = createdSection.payload.metadata._id;
          lectureData.url = fileUrl;
          
          // Create the lecture
          await lectureService.createOneLecture(lectureData);
        }
      }

      return new CreatedResponse({
        message: "Course with sections and lectures created successfully",
        metadata: createdCourse
      });
    }
    catch (error) {
      return new InternalServerError();
    }
  }

  async getAllCoursesByUserId(instructorId) {
    try {
      let listCourse = await this.repository.getAll();
      listCourse = listCourse.filter((course) => course.instructorId.toString() === instructorId.toString());
      if (listCourse.length === 0) {
        return new NotFoundResponse("Empty list of courses");
      }
      return new SuccessResponse({
        message: "Select list courses successfully",
        metadata: listCourse,
      });
    }
    catch (error) {
      return new InternalServerError();
    }
  }

  async getAllCourses() {
    try {
      const listCourse = await this.repository.getAll();
      if (!listCourse) {
        return new NotFoundResponse("Empty list of courses");
      }
      return new SuccessResponse({
        message: "Select list courses successfully",
        metadata: listCourse,
      });
    }
    catch (error) {
      return new InternalServerError();
    }
  }

  async getCourseById(courseId) {
    try {
      // console.log(courseId);
      const course = await this.repository.getByEntity({ _id: courseId });
      if (!course) {
        return new NotFoundResponse("Course not found");
      }
      return new SuccessResponse({
        message: "Course found",
        metadata: course,
      });
    } catch (error) {
      console.error(error);
      return new InternalServerError();
    }
  }

  async getCourseByName(data) {
    try {
      const { name, instructorId } = data;
      if (!name || !instructorId) {
        return new BadRequest("Course name and instructor id are required");
      }
      
      let courses;
      if (instructorId) {
        const regex = new RegExp(name, 'i');
        courses = await this.repository.getAllByCourseName(regex);
        courses = courses.filter((course) => course.instructorId.toString() === instructorId.toString());
      }
  
      if (!courses || courses.length === 0) {
        return new NotFoundResponse("Course not found");
      }
      
      return new SuccessResponse({
        message: "Course(s) found",
        metadata: courses,
      });
    } catch (error) {
      console.error(error);
      return new InternalServerError();
    }
  }

  async updateCourse(data) {
    try {
      const { _id, name, imageUrl, description } = data;
      
      // Check if the _id field is provided
      if (!_id) {
        return new BadRequest("Course ID is required for updating");
      }
  
      const updateEntity = { name, imageUrl, description };
  
      const updatedCourse = await this.repository.update({ _id }, updateEntity);
  
      if (!updatedCourse) {
        return new NotFoundResponse("Course not found");
      }
  
      return new SuccessResponse({
        message: "Course updated successfully",
        metadata: updatedCourse,
      });
    } catch (error) {
      console.error(error);
      return new InternalServerError();
    }
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
