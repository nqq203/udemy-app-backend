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
    token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiI2NjM2M2I2OThlYzJhOThjNWE5NjVlNjkiLCJ1c2VySWQiOiI2NjBlMjgxODgyYTJjZDMwMDQwYWUxYWMiLCJpYXQiOjE3MTQ4MzAxODYsImV4cCI6MTcxNDgzMzc4Nn0.wvLcZwzasQr2puFhMLq9MDbJRR4EW3qPUU0PjDGkyuU'
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
