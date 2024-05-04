const request = require('supertest');
const app = require('../src/app'); 

describe('orderRouter.post(\'/create\')', () => {
  const endPoint = '/orders/create'; // Assuming the actual endpoint
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  let orderData, token;

  beforeAll(() => {
    orderData = {
      userId: "123456",
      items: [{
          itemId: "123456",
          price: 100,
      }],
      price: 100,
      paymentId: "123456",
    };
    token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiI2NjM1YzM3MDQ5YWQ0ZDhkOTYxOTQ1MTYiLCJ1c2VySWQiOiI2NjI0MDIyMDY4ZjhiMDk4MjFjYTQ0M2IiLCJpYXQiOjE3MTQ3OTk0NzIsImV4cCI6MTcxNDgwMzA3Mn0.hH3D74HhhrDVgoVUYQ0W1EbN_fLkVj1LV8gyORSXSHM'
  });

  test('should return 401 if no token is provided', async () => {
    const response = await request(app)
      .post(endPoint)
      .send({orderData: JSON.stringify(orderData)});  



    expect(response.statusCode).toBe(200);
    expect(response.body.code).toBe(401);
    expect(response.body.message).toBe('Bạn cần phải đăng nhập');
  });

  test('should return 400 if no order data is provided', async () => {
    const response = await request(app)
      .post(endPoint)
      .set('Authorization', token)



    expect(response.statusCode).toBe(200);
    expect(response.body.code).toBe(400);
    expect(response.body.message).toBe('Order data is required');
  });
});
