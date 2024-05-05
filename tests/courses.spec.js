const request = require('supertest');
const app = require('../src/app');

describe('courseRouter.post(\'/create-one-course\')', () => {
    const endPoint = '/courses/create-one-course'; // Assuming the actual endpoint
    afterEach(() => {
      jest.clearAllMocks(); 
    });
  
  
    let courseData, courseDataInvalidInsId, mockImageFile, token;
  
    beforeAll(() => {
      courseData = { instructorId: '6603c2c0ec6ca06713093b35',
      category: "DEVELOPMENT",
      description: "Learn Android 14 App Development From Beginner to Advanced Developer. Build Apps like Trello, 7Min Workout, Weather App",
      price: 1700000,
      name: "The Complete Android 14 & Kotlin Development Masterclass",
      imageURL: null,
      };
      courseDataNoInsId = { instructorId: '6603c2c12345676713093b35',
      category: "DEVELOPMENT",
      description: "Learn Android 14 App Development From Beginner to Advanced Developer. Build Apps like Trello, 7Min Workout, Weather App",
      price: 1700000,
      name: "The Complete Android 14 & Kotlin Development Masterclass",
      imageURL: null,
      };
      mockImageFile = { path: "", mimetype: 'image/jpeg' }; 
      token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiI2NjM1YzM3MDQ5YWQ0ZDhkOTYxOTQ1MTYiLCJ1c2VySWQiOiI2NjI0MDIyMDY4ZjhiMDk4MjFjYTQ0M2IiLCJpYXQiOjE3MTQ3OTk0NzIsImV4cCI6MTcxNDgwMzA3Mn0.hH3D74HhhrDVgoVUYQ0W1EbN_fLkVj1LV8gyORSXSHM'
    });
  
    test('should return 401 if no token is provided', async () => {
      const response = await request(app)
        .post(endPoint)
        .send({courseData: JSON.stringify(courseData)});  
  
      expect(response.statusCode).toBe(200);
      expect(response.body.code).toBe(401);
      expect(response.body.message).toBe('Bạn cần phải đăng nhập');
    });

    test('should return 400 if no course Data is provided', async () => {
      
      const response = await request(app)
        .post(endPoint)
        .set('Authorization', token)
        .attach('imageFile', mockImageFile.path)
  
       
  
      expect(response.statusCode).toBe(200);
      expect(response.body.code).toBe(400);
      expect(response.body.message).toBe("Please fill all the fields");
    });
  
    test('should return 404 if user not found', async () => {
      
      const response = await request(app)
        .post(endPoint)
        .set('Authorization', token)
        .attach('imageFile', mockImageFile.path)
        .send({courseData: JSON.stringify(courseDataInvalidInsId)})
  
       
  
      expect(response.statusCode).toBe(200);
      expect(response.body.code).toBe(404);
      expect(response.body.message).toBe("Instructor not found");
    });
});