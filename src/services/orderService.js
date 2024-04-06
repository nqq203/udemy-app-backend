const OrderRepository = require("../repositories/orderRepository");
const {
  BadRequest,
  InternalServerError,
  NotFoundResponse,
} = require("../common/error.response");
const {
  CreatedResponse,
  SuccessResponse,
} = require("../common/success.response");
const { ORDER_STATUS, PAYMENT_METHOD } = require("../constants/order.constant");

module.exports = class OrderService {
  constructor() {
    this.repository = new OrderRepository();
  }

  async createOrder(data) {
    try {
      const { userId, items, country, price, paymentMethod } = data;
      if (!userId || !items || !country || !price || !paymentMethod) {
        return new BadRequest("Missed information");
      }

      const order = await this.repository.create({
        userId: userId,
        items: items,
        country: country,
        price: price,
        status: ORDER_STATUS.PENDING,
        paymentMethod: paymentMethod === "paypal" ? PAYMENT_METHOD.WALLET : PAYMENT_METHOD.CREDIT_CARD,
      });

      if (!order) {
        return new BadRequest("Create order failed");
      }
      return new CreatedResponse({
        message: "Create order successfully",
        metadata: order,
      });
    } catch (err) {
      console.log(err);
      return new InternalServerError();
    }
  }

  async getOrderByUser(userId) {
    try {
      const order = await this.repository.getByEntity(userId);
      if (!order) {
        return new NotFoundResponse("Order not found");
      }
      return new SuccessResponse({message: "Order found", metadata: order});
    } catch (err) {
      console.log(err);
      return new InternalServerError();
    }
  }

  async getAllOrders() {
    try {
      const orders = await this.repository.getAll();
      if (!orders) {
        return new NotFoundResponse("Order not found");
      }
      return new SuccessResponse({message: "Order found", metadata: orders});
    } catch (err) {
      console.log(err);
      return new InternalServerError();
    }
  }

  //Update, Delete,...
};
