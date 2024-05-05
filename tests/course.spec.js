const request = require('supertest');
const app = require('../src/app'); 

describe('courseRouter.get(\'/course-learning\')', () => {
    const endPoint = '/courses/course-learning?courseId=66267f722628c10a59db7c61'; // Assuming the actual endpoint
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    let courseId,sessionId,userId, token;

    beforeAll(() => {
        courseId = "66267f722628c10a59db7c61";
        token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiI2NjM3NWNhYmNiMDBiYTE1NGJmMzNjYWIiLCJ1c2VySWQiOiI2NjI0MDIyMDY4ZjhiMDk4MjFjYTQ0M2IiLCJpYXQiOjE3MTQ5MDQyMzUsImV4cCI6MTc0NjQ2MTgzNX0.NnD3yBFUtJPARXSNUPFcI6ORCxm9q2x52KeLSSVbSuM'
    })

    test('should return 401 if no token is provided', async () => {
        const response = await request(app)
          .get(endPoint)
          .send({courseId: courseId});  
    
        expect(response.statusCode).toBe(200);
        expect(response.body.code).toBe(401);
        expect(response.body.message).toBe('Bạn cần phải đăng nhập');
    });

    test('Shoulf return 401 if course is not registered', async () => {
        
        const response = await request(app)
            .get("/courses/course-learning?courseId=6622007397b3cb407f37a8b5")
            .set('Authorization', token)

        expect(response.statusCode).toBe(200);
        expect(response.body.code).toBe(401);
        expect(response.body.message).toBe('Unregistered course');

    })

    test('Shoulf return 200 if course is registered', async () => {
        const response = await request(app)
            .get(endPoint)
            .set('Authorization', token)
            

        expect(response.statusCode).toBe(200);
        expect(response.body.code).toBe(200);
        expect(response.body.message).toBe('Course found');

    })

    
});