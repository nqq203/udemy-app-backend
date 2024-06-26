const CourseRepository = require("../repositories/courseRepository");
const UserService = require("../services/userService");
const SectionService = require("../services/sectionService");
const LectureService = require("../services/lectureService");
const { uploadFileToCloud } = require("../utils/cloudinary");
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

  async getAllCourses() {
    try {
      const courses = await this.courseRepo.getAll();
      if (!courses || courses.length == 0) {
        return new NotFoundResponse("Courses not found")
      }
      return new SuccessResponse({ message: "Courses found", metadata: courses });
    } catch (error) {
      console.log(error);
      return new InternalServerError();
    }
  }

  async getCoursesByRating(ratings) {
    try {
      const courses = await this.courseRepo.getAllByEntity({ ratings });
      if (!courses || courses.length == 0) {
        return new NotFoundResponse(`Courses with ${ratings} ratings not found`)
      }
      return new SuccessResponse({ message: `Courses with ${ratings} ratings found`, metadata: courses });
    } catch (error) {
      console.log(error);
      return new InternalServerError();
    }
  }

  // Get all information of the course including sections,lectures and instructor
  async getCourseById(_id) {
    try {
      if(!_id){
        return new BadRequest("CourseId is required")
      }
      const course = await this.courseRepo.getCoursebyId({ _id });
      let courseId = _id
      const sections = await this.sectionRepo.getAllByEntity({ courseId })
      var lectures = []

      var _id = course.instructorId
      var instructor = await this.userRepo.getByEntity({ _id })

      if (!sections) {
        // Handle the case where sections is undefined or empty
        return new NotFoundResponse("Sections not found");
      }

      if (!instructor) {
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


      if (!course) {
        return new NotFoundResponse("Course not found");
      }
      return new SuccessResponse({ message: "Course found", metadata: { course, instructor, sections, lectures } });
    } catch (error) {
      console.log(error);
      return new InternalServerError();
    }
  }

  async getCoursePagination(pageNumber, PAGE_SIZE = 3, query = {}) {
    try {
      const courses = await this.courseRepo.getCoursePagination(pageNumber, PAGE_SIZE, query);
      if (!courses || courses.length == 0) {
        return new NotFoundResponse("Courses pagination not found")
      }

      var instructors = []
      for(var i = 0; i < courses?.results.length; i++){
        const _id = courses?.results[i].instructorId;
        const instructor = await this.userRepo.getByEntity(_id);
        instructors.push(instructor.fullName);
      }

      courses.instructors = instructors

      return new SuccessResponse({ message: "Courses pagination found", metadata: courses });
    } catch (error) {
      console.log(error);
      return new InternalServerError();
    }
  }

  async getUserCourses(courses) {
    try {
      const userCourses = await this.repository.getAllUserCourses(courses);
      if (!userCourses) {
        return new NotFoundResponse("Empty list of courses");
      }
      return new SuccessResponse({
        message: "Select list courses successfully",
        metadata: userCourses,
      });
    }
    catch (error) {
      return new InternalServerError();
    }
  }

    // async getCoursePagination(pageNumber,PAGE_SIZE=3, query = {}){
    //     try {
    //         const courses = await this.courseRepo.getCoursePagination(pageNumber,PAGE_SIZE, query);
    //         if(!courses || courses.length == 0){
    //             return new NotFoundResponse("Courses pagination not found")
    //         }
            
    //         var instructors = []
    //         await Promise.all(courses?.results.map(async (course) => {
    //             const _id = course.instructorId;
    //             const instructor = await this.userRepo.getByEntity(_id);
    //             instructors.push(instructor.fullName);
    //         }));
    //         courses.instructors = instructors

    //         return new SuccessResponse({message: "Courses pagination found",metadata: courses});
    //     } catch (error) {
    //         console.log(error);
    //         return new InternalServerError();
    //     }
    // }

  async getCoursesBySearch(category,keyword,pageNumber,rating=0){
      try {
          const PAGE_SIZE=10
          // console.log(keyword);
          // if (!keyword) {
          //   return new BadRequest("Keywords id are required");
          // }

          var query;

          if(keyword != ""){
            // search by keyword
            var regex;
            regex = new RegExp(keyword, 'i');
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
          } else if(category != ""){
            category = category.toUpperCase();

            // search by category
            if(rating == 0){
              // no filter rating
              query = { "category": category }
            } else{
              // filter rating
              query = { 
                  category: category , 
                  $or: [{"ratings": rating},{"ratings": { $gt: rating}}]
              };
            }
          }
                    
          const data = await this.courseRepo.getCoursePagination(pageNumber,PAGE_SIZE,query)

          if (!data) {
            return new NotFoundResponse("No data to show");
          }
          
          var instructors = []
          var durationList = []
          for(var i = 0;i < data?.results.length; i++ ){
              const course = data?.results[i]
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
          };
          data.instructors = instructors
          data.durationList = durationList
          // console.log(data)
          
          return new SuccessResponse({message: "Course(s) found",metadata: data});
      } catch (error) {
          console.log(error);
          return new InternalServerError();
      }
  }

  async createCourse(data, imageFile) {
    try {
      const { name, description, instructorId, category, publish } = data;
      if (!name || !description || !instructorId || !category) {
        throw new BadRequest("Please fill all the fields");
      }

      const thumbnailUrl = await uploadFileToCloud(imageFile);
      console.log(thumbnailUrl);
      const courseData = {
        name,
        description,
        instructorId,
        category,
        imageUrl: thumbnailUrl,
        publish,
        price: 0
      }
      console.log(courseData);
      const user = new UserService();
      const existInstructor = await user.getUserById(instructorId);
      if (!existInstructor) {
        return new NotFoundResponse("Instructor not found");
      }
      const course = await this.courseRepo.create(courseData);
      return new CreatedResponse({
        message: "Course created successfully",
        metadata: course,
      });
    } catch (error) {
      console.log(error);
      return new InternalServerError();
    }
  }

  async getAllCoursesByUserId(instructorId) {
    try {
      let listCourse = await this.courseRepo.getAll();
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

  async getCourseByCId(courseId) {
    try {
      const course = await this.courseRepo.getByEntity({ _id: courseId });
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
        courses = await this.courseRepo.getAllByCourseName(regex);
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

  async updateCourse(data, imageFile) {
    try {
      const { _id, name, description, instructorId, category, publish, price } = data;
      // Check if the _id field is provided
      if (!_id) {
        return new BadRequest("Course ID is required for updating");
      }

      var updateEntity;
      var thumbnailUrl;
      if (imageFile) {
        thumbnailUrl = await uploadFileToCloud(imageFile);
        console.log(imageFile);
        updateEntity = { name, description, instructorId, category, price, publish, imageUrl: thumbnailUrl };
      }
      else {
        updateEntity = { name, description, instructorId, category, publish, price };
      }

      const updatedCourse = await this.courseRepo.update({ _id }, updateEntity);

      if (!updatedCourse) {
        return new NotFoundResponse("Course not found");
      }
      const newResponse = {
        ...updatedCourse._doc,
        name: name,
        description: description,
        instructorId: instructorId,
        category: category,
        publish: publish,
        price: price || updatedCourse._doc.price,
        imageUrl: thumbnailUrl || updatedCourse._doc.imageUrl
      }

      return new SuccessResponse({
        message: "Course updated successfully",
        metadata: newResponse,
      });
    } catch (error) {
      console.error(error);
      return new InternalServerError();
    }
  }

  async deleteCourse(courseId) {
    try {
      const sectionService = new SectionService();
      const sections = await sectionService.getSectionsByCourseId(courseId);

      if (sections.code !== 404) {  
        await Promise.all(sections.payload.metadata.map(async section => {
          await sectionService.deleteSection(section._id);
        }))
      }

      const deletedCourse = await this.courseRepo.delete({ _id: courseId });
      if (!deletedCourse) {
        return BadRequest("Delete course not found");
      }
      return new SuccessResponse({
        message: "Course deleted successfully",
        metadata: deletedCourse,
      });
    }
    catch (error) {
      return new InternalServerError();
    }
  }

  async getInstructorDetailCourse(courseId) {
    try {
      const course = await this.courseRepo.getCoursebyId({ _id: courseId });

      if (!course) {
        throw new Error('Course not found');
      }
      // Assuming Section and Lecture Repositories have similar findById methods
      const sectionService = new SectionService;
      const lectureService = new LectureService;

      const sections = await sectionService.getSectionsByCourseId(courseId);
      if (sections.code === 404) {
        return new SuccessResponse({
          message: "Intructor course found",
          metadata: { course }
        })
      }
      let allLectures = [];
      const lectures = await Promise.all(sections.payload.metadata.map(async (section) => {
        const result = await lectureService.getLecturesBySectionId(section._id); // Added 'await' here
        if (result && result.payload && result.payload.metadata) {
          allLectures = allLectures.concat(result.payload.metadata); // Properly concatenating array
        }
        return result;
      }));

      if (lectures.code === 404) {
        return new SuccessResponse({
          message: 'Instructor detail course found',
          metadata: { course: course, sections: sections.payload.metadata }
        })
      }
    
      return new SuccessResponse({
        message: 'Instructor detail course found',
        metadata: { course: course, sections: sections.payload.metadata, lectures: allLectures }
      });
    } catch (error) {
      console.error(error);
      return new InternalServerError();
    }
  }

  async getRelatedCourses(courseId) {
    try {
      const courses = await this.courseRepo.getRelatedCourses(courseId);
      if (courses.length === 0) {
        return new NotFoundResponse("No related courses found");
      }
      else {
        return new SuccessResponse({
          message: "Related courses found",
          metadata: courses
        });
      }
    } catch (error) {
      console.log(error);
      return new InternalServerError();
    }
  }

}
