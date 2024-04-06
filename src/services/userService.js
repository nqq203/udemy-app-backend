const bcrypt = require("bcrypt");

const UserRepository = require("../repositories/userRepository");
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
module.exports = class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  async createUser(data) {
    try {
      const { fullName, email, password } = data;
      if (!fullName || !email || !password) {
        return new BadRequest("Missed information");
      }

      const userExists = await this.repository.getByEntity({ email });
      if (userExists) {
        return new ConflictResponse("User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.repository.create({
        fullName,
        email,
        password: hashedPassword,
      });

      if (!user) {
        return new BadRequest("Create user failed");
      }
      return new CreatedResponse({
        message: "Create user successfully",
        metadata: user,
      });
    } catch (err) {
      console.log(err);
      return new InternalServerError();
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await this.repository.getByEntity({ email });
      if (!user) {
        return new NotFoundResponse("User not found");
      }
      return new SuccessResponse({message: "User found", metadata: user});
    } catch (err) {
      console.log(err);
      return new InternalServerError();
    }
  }

  async getAllUsers() {
    try {
      const users = await this.repository.getAll();
      if (!users) {
        return new NotFoundResponse("User not found");
      }
      return new SuccessResponse({message: "User found", metadata: users});
    } catch (err) {
      console.log(err);
      return new InternalServerError();
    }
  }

  //Update, Delete,...
};
