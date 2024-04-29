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

const CourseService = require("./courseService");
const courseService = new CourseService();
module.exports = class OrderService {
  constructor() {
    this.repository = new OrderRepository();
  }

  async createOrder(data) {
    try {
      const { userId, items, price, paymentId } = data;
      if (!userId || !items || !price ) {
        return new BadRequest("Missed information");
      }

      const allOrders = await this.repository.getByEntity({ userId });
      var isPurchasedCourse = false;
      allOrders.forEach((order) => {
        order.items.forEach((item) => {
          items.forEach((newItem) => {
            if (item.itemId.toString() === newItem.itemId.toString()) {
              isPurchasedCourse = true;
              return;
            }
          });
        });
      });
      
      if(isPurchasedCourse) {
        return new BadRequest("You already purchased this course");
      }

      const order = await this.repository.create({
        userId: userId,
        items: items,
        price: price,
        status: paymentId ? ORDER_STATUS.COMPLETED : ORDER_STATUS.PENDING,
        paymentId: paymentId || "",
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

  async getCompletedOrdersByInstructorId(instructorId) {
    try {
      // Get all completed orders
      const orders = await this.repository.getCompletedOrdersByInstructorId(instructorId);

      if (!orders) {
        return new NotFoundResponse("Order not found");
      }
      
      return new SuccessResponse({message: "Order found", metadata: orders});
    } catch (err) {
      console.log(err);
      return new InternalServerError();
    }
  }

  async getCompletedOrdersByInstructorIdAndYear(instructorId, year) {
    try {
      const result = await this.repository.getCompletedOrdersByInstructorIdAndYear(instructorId, year);
      return new SuccessResponse({message: "Orders found", metadata: result});
    } catch (error) {
      console.error(error);
      return new InternalServerError();
    }
  }

  //Update, Delete,...
};
