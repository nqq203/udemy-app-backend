const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

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

  async signIn(data) {
    try {
      const { email, password } = data;
      if (!email || !password) {
        return new BadRequest("Email and password are required");
      }
  
      // Check if the user exists in the database
      const user = await this.repository.getByEntity({ email });
      if (!user) {
        return new NotFoundResponse("User not found");
      }
  
      // Compare the provided password with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return new BadRequest("Invalid email or password");
      }
      
      const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET_KEY, {expiresIn: '1m'});
      // Return a success response if authentication is successful
      return new SuccessResponse({ message: "Sign-in successful", metadata: {token, ROLE: user} });
    } catch (err) {
      console.log(err);
      return new InternalServerError();
    }
  }
  
  async getUserById(userId) {
    try {
      const user = await this.repository.getByEntity({ _id: userId });
      if (!user) {
        return new NotFoundResponse("User not found");
      }
      return new SuccessResponse({message: "User found", metadata: user});
    } catch (err) {
      console.log(err);
      return new InternalServerError();
    }
  }
  //Update, Delete,...
};
