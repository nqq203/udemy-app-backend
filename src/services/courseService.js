const CourseRepository  = require("../repositories/courseRepository");
const UserService = require("../services/userService");
const SectionService = require("../services/sectionService");
const LectureService = require("../services/lectureService");

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

module.exports = class CourseService {
  constructor() {
    this.repository = new CourseRepository();
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
          const file = files[fileIndex++];
          console.log(file);
          const videoUploadResponse = await cloudinary.uploader.upload(file.path, {
            resource_type: "video",
            public_id: `${createdCourse.name}/${createdSection.name}/${file.filename}`,
          });

          // Add sectionId and course Id to lectureData
          lectureData.sectionId = createdSection.payload.metadata._id;
          lectureData.url = videoUploadResponse.secure_url;
          
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
      console.log(courseId);
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
}