const request = require('supertest');
const app = require('../src/app'); 

describe('lectureRouter.post(\'/create\')', () => {
  const endPoint = '/lectures/create'; // Assuming the actual endpoint
  afterEach(() => {
    jest.clearAllMocks(); 
  });


  let lectureData, mockVideoFile, token;

  beforeAll(() => {
    lectureData = { title: 'Test Lecture', sectionId: 123 };
    mockVideoFile = { path: "", mimetype: 'video/mov' }; 
    token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiI2NjM3MzY2ZDg5YzdhODc4MzMxODhjYjUiLCJ1c2VySWQiOiI2NjI0MDIyMDY4ZjhiMDk4MjFjYTQ0M2IiLCJpYXQiOjE3MTQ4OTQ0NDYsImV4cCI6MTcxNDg5ODA0Nn0.ZvYfLB-SX1XF_B9hDIdsV07tL12vLKmXv_ANlvLGWlw'
  });

  test('should return 401 if no token is provided', async () => {
    const response = await request(app)
      .post(endPoint)
      .send({lectureData: JSON.stringify(lectureData)});  

    expect(response.statusCode).toBe(200);
    expect(response.body.code).toBe(401);
    expect(response.body.message).toBe('Bạn cần phải đăng nhập');
  });
  test('should return 400 if no lecture Data is provided', async () => {
    
    const response = await request(app)
      .post(endPoint)
      .set('Authorization', token)
      .attach('videoFile', mockVideoFile.path)

     

    expect(response.statusCode).toBe(200);
    expect(response.body.code).toBe(400);
    expect(response.body.message).toBe('Lecture data is required');
  });

  test('should return 400 if no video file is provided', async () => {

    const response = await request(app)
      .post(endPoint)
      .set('Authorization', token)
      .send({lectureData: JSON.stringify(lectureData)})

     

    expect(response.statusCode).toBe(200);
    expect(response.body.code).toBe(400);
    expect(response.body.message).toBe('Video file is required');
  });
});
