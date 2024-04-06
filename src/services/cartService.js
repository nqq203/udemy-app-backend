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

// const sessionConstant = require("../constants/session.constant");
module.exports = class UserService {
  constructor() {
    this.repository = new CartRepository();
    // this.sessionRepository = new SessionRepository();
  }

  async createCart(data) {
    try {
      if (!data.itemId) 
        return new BadRequest("Missed information");
      const cart = await this.repository.create(data);
      const newCart = await cart.save();
      return new CreatedResponse({message: "Cart created", metadata: newCart});
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async getCart(userId){
    try {
      const carts = await this.repository.getAll(userId);
      if (!carts) {
        return new NotFoundResponse("Cart not found");
      }
      carts.map(cart => {
        cart.itemId = cart.itemId.toString()
        
      })
      return new SuccessResponse({message: "Cart found", metadata: carts});
    }catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteCart(data){
    try {
      if (!data.itemId){
        return new BadRequest("Missed information");
      }
      const deletedCart = await this.repository.delete(data);
      return new SuccessResponse({message: "Cart deleted", metadata: deletedCart});
    }catch (error) {
      console.error(error);
      return null;
    }
  }
}
