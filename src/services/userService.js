const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
// const { ObjectId } = mongoose.Schema;
const UserRepository = require("../repositories/userRepository");
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
const sessionConstant = require("../constants/session.constant");
module.exports = class UserService {
  constructor() {
    this.repository = new UserRepository();
    this.sessionRepository = new SessionRepository();
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

  async signIn(data){
    const {email, password} = data;

    const user = await this.repository.getByEntity({email});
    if(!user){
      return new NotFoundResponse("User not found");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword){
      return new BadRequest("Invalid password");
    }
    const expiredTime = moment().subtract(1, 'hour');
    const currentSession = await this.sessionRepository.getByEntity({userId: user._id, status: sessionConstant.STATUS_TOKEN.ACTIVE, expiredAt: {$gte: expiredTime}});
    if (currentSession){
      const updateSession = await this.sessionRepository.update({_id: currentSession._id}, {status: sessionConstant.STATUS_TOKEN.INACTIVE, logoutAt: moment()});
      
      if (!updateSession) {
        return new InternalServerError();
      }
    }
    const session = await this.sessionRepository.create({
      userId: user._id,
      expiredAt: moment().add(1, 'hour'),
      status: sessionConstant.STATUS_TOKEN.ACTIVE
    })
    const token = jwt.sign({sessionId: session._id, userId: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});

    return new SuccessResponse({message: "Login successfully", metadata: {userInfo: user, accessToken: token}});
  }

  async signOut(data){
    const {sessionId} = data;
    const session = await this.sessionRepository.update({sessionId}, {status: sessionConstant.STATUS_TOKEN.INACTIVE, logoutAt: moment()});
    if (!session) {
      return new InternalServerError();
    }
    return new SuccessResponse({message: "Logout successfully"});
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
