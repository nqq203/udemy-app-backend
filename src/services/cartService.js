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
const courseService = require('./courseService');
module.exports = class UserService {
  constructor() {
    this.repository = new CartRepository();
    this.courseRepository = new CourseRepository();

    this.courseService = new courseService();
  }

  async createCart(data) {
    try {
      if (!data.itemId) return new BadRequest('Missed information');

      const cartExists = await this.repository.getByEntity(data);
      if (cartExists) {
        return new ConflictResponse('Cart already exists');
      }
      const cart = await this.repository.create(data);
      const newCart = await cart.save();
      return new CreatedResponse({
        message: 'Add item to cart successfully',
        metadata: newCart,
      });
    } catch (error) {
      console.error(error);
      return new Response({
        success: false,
        code: error.code || 500,
        message: error.message || 'Internal server error',
        data: null,
      });
    }
  }

  async getCart(userId) {
    try {
      const carts = await this.repository.getAll(userId);
      if (!carts) {
        return new NotFoundResponse('Cart not found');
      }
      let itemCartList = [];
      await Promise.all(
        carts.map(async (cart) => {
          cart.itemId = cart.itemId.toString();
          // const itemCart = await this.courseRepository.getCoursebyId(
          //   cart.itemId
          // );
          const itemCart = await this.courseService.getCourseById(cart.itemId);
          console.log(itemCart);  
          if (!itemCart || itemCart.success === false) {
            console.log("Course not found", itemCart);
          }
          else itemCartList.push(itemCart.payload?.metadata);
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
      if (!data.itemId || !data.userId) {
        return new BadRequest('Missed information');
      }
      const deletedCart = await this.repository.delete(data);
      if (!deletedCart) {
        return new NotFoundResponse('Cart not found');
      }
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


