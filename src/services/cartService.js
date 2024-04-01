const CartRepository = require("../repositories/cartRepository");
const CourseRepository = require("../repositories/courseRepository");
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
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

module.exports = class CartService {
  constructor() {
    this.repository = new CartRepository();
    this.courseRepository = new CourseRepository();
  }

  async createCart(data) {
    try {
      console.log(data);
      if (data.itemId === "") {
        return new BadRequest("Missed information");
      }
      data = {
        userId: new ObjectId(data.userId),
        itemId: new ObjectId(data.itemId),
      };
      const cart = this.repository.create(data);
      if (!cart) {
        return new BadRequest("Create cart failed");
      }
      return new CreatedResponse({ message: "Cart created", metadata: cart });
    } catch (err) {
      console.log(err);
      return new InternalServerError();
    }
  }

  async getCart(userId) {
    try {
      let cart = await this.repository.getCart(userId);

      if (!cart) {
        return new NotFoundResponse("No data found in cart");
      }
  
      let itemList = [];
  
      await Promise.all(cart.map(async (item) => {
        const course = await this.courseRepository.getCourseById(item.itemId);
        console.log(123, course);
        itemList.push(course);
      }));
  
      console.log(123, itemList);
  
      console.log(345678);
      return new SuccessResponse({ message: "Cart found", metadata: itemList });
    } catch (err) {
      console.log(err);
      return new InternalServerError();
    }
  }
  
};
