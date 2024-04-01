const SessionRepository = require("../repositories/sessionRepository");
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
    this.repository = new UserRepository();
    this.sessionRepository = new SessionRepository();
  }

  async createCart(data) {
    try {
      const cart = new Carts(data);
      return await cart.save();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}