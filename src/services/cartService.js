const CartRepository = require('../repositories/cartRepository');
const CourseRepository = require('../repositories/courseRepository');
const {
  ConflictResponse,
  BadRequest,
  InternalServerError,
  NotFoundResponse,
} = require('../common/error.response');
const {
  CreatedResponse,
  SuccessResponse,
} = require('../common/success.response');

module.exports = class UserService {
  constructor() {
    this.repository = new CartRepository();
    this.courseRepository = new CourseRepository();
  }

  async createCart(data) {
    try {
      if (!data.itemId) return new BadRequest('Missed information');
      const cart = await this.repository.create(data);
      const newCart = await cart.save();
      return new CreatedResponse({
        message: 'Cart created',
        metadata: newCart,
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getCart(userId) {
    try {
      const carts = await this.repository.getAll(userId);
      if (!carts) {
        return new NotFoundResponse('Cart not found');
      }
      console.log(carts.length);
      let itemCartList = [];
      await Promise.all(
        carts.map(async (cart) => {
          cart.itemId = cart.itemId.toString();
          const itemCart = await this.courseRepository.getCoursebyId(
            cart.itemId
          );
          itemCartList.push(itemCart);
        })
      );
      
      return new SuccessResponse({
        message: 'Cart found',
        metadata: itemCartList,
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteCart(data) {
    try {
      if (!data.itemId) {
        return new BadRequest('Missed information');
      }
      const deletedCart = await this.repository.delete(data);
      return new SuccessResponse({
        message: 'Cart deleted',
        metadata: deletedCart,
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  //Testing Service
  async getAllCart(userId) {
    try {
      const carts = await this.repository.getAll(userId);
      if (!carts) {
        return new NotFoundResponse('Cart not found');
      }

      return new SuccessResponse({
        message: 'Cart found',
        metadata: carts,
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteAllCart(userId) {
    try {
      const deletedCart = await this.repository.deleteAll({ userId });
      return new SuccessResponse({
        message: 'Cart deleted',
        metadata: deletedCart,
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }
};


