const bcrypt = require('bcrypt');

const UserRepository = require('../repositories/userRepository');
const BaseResponse = require('../utils/baseResponse');
const { STATUS_CODE } = require('../constants/statuscode.constant');

module.exports = class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  async createUser(data) {
    try {
      const { fullname, email, password } = data;
      if (!fullname || !email || !password) {
        return new BaseResponse(STATUS_CODE.BAD_REQUEST, false, 'Missed information');
      }

      const userExists = await this.repository.getByEntity({email});
      if (userExists) {
        return new BaseResponse(STATUS_CODE.CONFLICT, false, 'User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.repository.create({fullname, email, password: hashedPassword});
      if (!user) {
        throw new Error('Create user failed');
      }
      return new BaseResponse(STATUS_CODE.OK, true, 'User created successfully', user);
    } catch (err) {
      return new BaseResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, false, err.message);
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await this.repository.getByEntity({email});
      if (!user) {
        return new BaseResponse(STATUS_CODE.NOT_FOUND, false, 'User not found');
      }
      return new BaseResponse(STATUS_CODE.OK, true, 'User found', user);
    } catch (err) {
      return new BaseResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, false, err.message);
    }
  }

  async getAllUsers() {
    try {
      const users = await this.repository.getAll();
      if (!users) {
        return new BaseResponse(STATUS_CODE.NOT_FOUND, false, 'Users not found');
      }
      return new BaseResponse(STATUS_CODE.OK, true, 'Users found', users);
    } catch (err) {
      return new BaseResponse(STATUS_CODE.INTERNAL_SERVER_ERROR, false, err.message);
    }
  }

  //Update, Delete,...
}