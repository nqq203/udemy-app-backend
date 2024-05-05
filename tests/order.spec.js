const request = require('supertest');
const app = require('../src/app'); 

describe('orderRouter.post(\'/create\')', () => {
  const endPoint = '/orders/create';
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  let orderData, orderDataWithoutItems, token;

  beforeAll(() => {
    orderData = {
      userId: "660e281882a2cd30040ae1ac",
      items: [
        {
          itemId: "661de8ca20d64b253d60ece9",
          price: 100,
        },
        {
          itemId: "661f3da7f99f882605188c82",
          price: 99,
        },
      ],
      price: 199,
      paymentId: "1234567890",
    };

    orderDataWithoutItems = {
      userId: "660e281882a2cd30040ae1ac",
      items: [],
      price: 199,
      paymentId: "1234567890",
    };

    token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiI2NjM3NWNhYmNiMDBiYTE1NGJmMzNjYWIiLCJ1c2VySWQiOiI2NjI0MDIyMDY4ZjhiMDk4MjFjYTQ0M2IiLCJpYXQiOjE3MTQ5MDQyMzUsImV4cCI6MTc0NjQ2MTgzNX0.NnD3yBFUtJPARXSNUPFcI6ORCxm9q2x52KeLSSVbSuM'
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

  test('should return 400 if no order items is provided', async () => {
    const response = await request(app)
      .post(endPoint)
      .set('Authorization', token)
      .send({orderData: JSON.stringify(orderDataWithoutItems)})

    expect(response.statusCode).toBe(200);
    expect(response.body.code).toBe(400);
    expect(response.body.message).toBe('Order data is required');
  });
});
