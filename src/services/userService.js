const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const moment = require("moment");
// const { ObjectId } = mongoose.Schema;
const UserRepository = require("../repositories/userRepository");
const SessionRepository = require("../repositories/sessionRepository");
const Upload = require("../utils/upload");
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

  async getWishlist(userId) {
    try {
      const user = await this.repository.getWishlist(userId);
      if (!user) {
        return new NotFoundResponse("User not found");
      }
      if (user.wishlist.length == 0)
        return new NotFoundResponse("Empty wishlist");
      return new SuccessResponse({
        message: "Get wishlist successfully",
        metadata: user.wishlist,
      });
    } catch (error) {
      console.log(error);
      return new InternalServerError();
    }
  }

  async addWishlistItem(userId, courseId) {
    try {
      const result = await this.repository.addWishlistItem(userId, courseId);
      if (result.wasItemAdded === false) {
        return new BadRequest(
          "Failed to add wishlist item or item already exists"
        );
      } else
        return new SuccessResponse({
          message: "Add wishlist item successfully",
          metadata: result.user,
        });
    } catch (error) {
      console.log(error);
      return new InternalServerError();
    }
  }

  async removeWishlistItem(userId, courseId) {
    try {
      const userBeforeUpdate = await this.repository.getByEntity({
        _id: userId,
      });
      const userAfterUpdate = await this.repository.update(
        { _id: userId },
        { $pull: { wishlist: courseId } }
      );
      console.log("user after update", userAfterUpdate)
      if (
        userAfterUpdate.wishlist.length === userBeforeUpdate.wishlist.length
      ) {
        return new BadRequest("Failed to remove wishlist item");
      } else {
        return new SuccessResponse({
          message: "Remove wishlist item successfully",
          metadata: userAfterUpdate,
        });
      }
    } catch (error) {
      console.log(error);
      return new InternalServerError();
    }
  }

  async createUser(data) {
    try {
      const { fullname, email, password } = data;
      if (!fullname || !email || !password) {
        return new BadRequest("Missed information");
      }

      const userExists = await this.repository.getByEntity({ email });
      if (userExists) {
        return new ConflictResponse("User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const activationToken = crypto.randomBytes(20).toString("hex");

      const user = await this.repository.create({
        fullName: fullname,
        email,
        password: hashedPassword,
        activationToken,
        activationTokenExpires: Date.now() + 3600000, // 1 giờ từ bây giờ
      });

      if (!user) {
        return new BadRequest("Create user failed");
      }

      // Cấu hình NodeMailer
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      // Nội dung email
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: user.email,
        subject: "Account Activation",
        html: `<p>Please click on the following link to activate your account:</p>
               <a href="${process.env.URL_FE}/activate-account/${activationToken}">Activate Account</a>`,
      };

      // Gửi email
      await transporter.sendMail(mailOptions);

      return new CreatedResponse({
        message: "Please confirm to activate your account",
      });
    } catch (err) {
      console.log(err);
      return new InternalServerError();
    }
  }

  async updateProfile(data) {
    try {
      const { email, fullName, biography, website, facebook, linkedin } = data;

      if (!fullName || !email) {
        return new BadRequest("Missed information");
      }

      const userExists = await this.repository.getByEntity({ email });
      if (!userExists) {
        return new NotFoundResponse("User not found");
      }

      const user = await this.repository.update(
        { email },
        {
          fullName,
          biography,
          website,
          facebook,
          linkedin,
        }
      );

      return new CreatedResponse({
        message: "Update profile successfully",
        metadata: user,
      });
    } catch (err) {
      console.log(err);
      return new InternalServerError();
    }
  }

  async updateAvatar(email, imageFile) {
    try {
      if (!imageFile || !email) {
        return new BadRequest("Missed information");
      }
      const uploadedResponse = await Upload.uploadFile(imageFile).catch(
        (error) => {}
      );
      const avatar = uploadedResponse.secure_url;
      if (uploadedResponse.secure_url) {
        console.log(avatar, email);
        const user = await this.repository.update(
          { email: email },
          { avatar: avatar }
        );
        if (!user) {
          return new BadRequest("Update avatar failed");
        }
        return new SuccessResponse({
          success: true,
          message: "Avatar updated successfully",
          metadata: user,
        });
      } else {
        throw new BadRequest("Image is wrong");
      }
    } catch (error) {
      console.log(error);
      return new InternalServerError();
    }
  }

  async handlePasswordChange(email, currentPassword, newPassword) {
    try {
      const userExists = await this.repository.getByEntity({ email });
      if (!userExists) {
        return new NotFoundResponse("User not found");
      }

      const isValidPassword = await bcrypt.compare(
        currentPassword,
        userExists.password
      );
      if (!isValidPassword) {
        return new BadRequest("Invalid password");
      }

      if (currentPassword === newPassword) {
        return new BadRequest(
          "New password must be different from the old password"
        );
      }

      if (!newPassword) {
        return new BadRequest("Missed information");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const user = await this.repository.update(
        { email: email },
        { password: hashedPassword }
      );

      if (!user) {
        return new BadRequest("Change password failed");
      }
      return new CreatedResponse({
        message: "Change password successfully",
        metadata: user,
      });
    } catch (err) {
      console.log(err);
      return new InternalServerError();
    }
  }

  async signIn(data) {
    const { email, password } = data;

    const user = await this.repository.getByEntity({ email });
    if (!user) {
      return new NotFoundResponse("User not found");
    }
    if (!user.isActivated) {
      return new BadRequest("Your account isn't activated");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return new BadRequest("Invalid password");
    }
    const expiredTime = moment().subtract(1, "hour");
    const currentSession = await this.sessionRepository.getByEntity({
      userId: user._id,
      status: sessionConstant.STATUS_TOKEN.ACTIVE,
      expiredAt: { $gte: expiredTime },
    });
    if (currentSession) {
      const updateSession = await this.sessionRepository.update(
        { _id: currentSession._id },
        { status: sessionConstant.STATUS_TOKEN.INACTIVE, logoutAt: moment() }
      );
      if (!updateSession) {
        return new InternalServerError();
      }
    }
    const session = await this.sessionRepository.create({
      userId: user._id,
      expiredAt: moment().add(1, 'hour'),
      status: sessionConstant.STATUS_TOKEN.ACTIVE
    })
    const token = jwt.sign({sessionId: session._id, userId: user._id}, process.env.JWT_SECRET_KEY);

    return new SuccessResponse({
      message: "Login successfully",
      metadata: { userInfo: user, accessToken: token },
    });
  }

  async signInWithOauth(data) {
    const { email } = data;

    const user = await this.repository.getByEntity({ email });
    if (!user) {
      return new NotFoundResponse("User not found");
    }
    user.isActivated = true;
    await this.repository.update({ email }, { ...user });
    const expiredTime = moment().subtract(1, "hour");
    const currentSession = await this.sessionRepository.getByEntity({
      userId: user._id,
      status: sessionConstant.STATUS_TOKEN.ACTIVE,
      expiredAt: { $gte: expiredTime },
    });
    if (currentSession) {
      const updateSession = await this.sessionRepository.update(
        { _id: currentSession._id },
        { status: sessionConstant.STATUS_TOKEN.INACTIVE, logoutAt: moment() }
      );
      if (!updateSession) {
        return new InternalServerError();
      }
    }
    const session = await this.sessionRepository.create({
      userId: user._id,
      expiredAt: moment().add(1, 'hour'),
      status: sessionConstant.STATUS_TOKEN.ACTIVE
    })
    const token = jwt.sign({sessionId: session._id, userId: user._id}, process.env.JWT_SECRET_KEY);

    return new SuccessResponse({
      message: "Login successfully",
      metadata: { userInfo: user, accessToken: token },
    });
  }

  async signOut(data) {
    const { sessionId } = data;
    const session = await this.sessionRepository.update(
      { _id: sessionId },
      { status: sessionConstant.STATUS_TOKEN.INACTIVE, logoutAt: moment() }
    );
    if (!session) {
      return new InternalServerError();
    }
    return new SuccessResponse({ message: "Logout successfully" });
  }

  async getUserByEmail(email) {
    try {
      const user = await this.repository.getByEntity({ email });
      if (!user) {
        return new NotFoundResponse("User not found");
      }
      return new SuccessResponse({ message: "User found", metadata: user });
    } catch (err) {
      return new InternalServerError();
    }
  }

  async getAllUsers() {
    try {
      const users = await this.repository.getAll();
      if (!users) {
        return new NotFoundResponse("User not found");
      }
      return new SuccessResponse({ message: "User found", metadata: users });
    } catch (err) {
      return new InternalServerError();
    }
  }

  async getUserById(userId) {
    try {
      const user = await this.repository.getByEntity({ _id: userId });
      if (!user) {
        return new NotFoundResponse("User not found");
      }
      return new SuccessResponse({ message: "User found", metadata: user });
    } catch (err) {
      return new InternalServerError();
    }
  }
  //Update, Delete,...

  async findOrCreateOauthUser(profile) {
    // console.log(profile);
    const email = profile.emails[0].value;
    let user = await this.repository.getByEntity({ email: email });
    if (user) {
      return user;
    } else {
      const newUser = {
        fullName: profile.displayName,
        email: email,
        googleId: profile.id,
      };
      const data = await this.repository.create(newUser);
      return data;
    }
  }

  async activateAccount(token) {
    try {
      const user = await this.repository.getByEntity({
        activationToken: token,
      });
      if (!user) {
        return new NotFoundResponse("Couldn't find user");
      }

      user.isActivated = true;
      user.activationToken = undefined;
      user.activationTokenExpires = undefined;
      const confirmationUser = await this.repository.update(
        { _id: user._id },
        {
          ...user,
        }
      );

      return new SuccessResponse({
        success: true,
        message: "Your account has been activated",
      });
    } catch (error) {
      return new InternalServerError();
    }
  }

  async forgotPassword(email) {
    try {
      const user = await this.repository.getByEntity({ email: email });
      if (!user) {
        return new NotFoundResponse("Couldn't find user");
      }
      const resetToken = crypto.randomBytes(20).toString("hex");
      const resetTokenExpires = moment().add(1, "hour");
      const resetPassword = await this.repository.update(
        { _id: user._id },
        {
          resetToken: resetToken,
          resetTokenExpires: resetTokenExpires,
        }
      );

      if (!resetPassword) {
        return new InternalServerError();
      }

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      const url = `${process.env.URL_FE}/reset-password/` + resetToken;
      console.log(url);
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset password",
        text:
          "Hello " +
          user.fullName +
          ",\n\n" +
          "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
          "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
          `${url}\n\n` +
          "If you did not request this, please ignore this email and your password will remain unchanged.\n",
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return new InternalServerError();
        }
      });

      return new SuccessResponse({
        success: true,
        message: "Reset password link has been sent to your email",
      });
    } catch (error) {
      console.log(error);
      return new InternalServerError();
    }
  }

  async resetPassword(token, password) {
    try {
      if (!token || !password) {
        return new BadRequestResponse("Missed information");
      }
      const user = await this.repository.getByEntity({ resetToken: token });
      if (!user) {
        return new NotFoundResponse("Couldn't find user");
      }

      if (moment().isAfter(user.resetTokenExpires)) {
        return new BadRequestResponse("Reset password link has expired");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpires = undefined;
      const resetPassword = await this.repository.update(
        { _id: user._id },
        {
          ...user,
        }
      );

      if (!resetPassword) {
        return new InternalServerError();
      }

      return new SuccessResponse({
        success: true,
        message: "Your password has been reset",
      });
    } catch (error) {
      console.log(error);
      return new InternalServerError();
    }
  }

  async checkToken(token) {
    try {
      const user = await this.repository.getByEntity({ resetToken: token });
      if (!user) {
        return new NotFoundResponse("Couldn't find user");
      }
      if (moment().isAfter(user.resetTokenExpires)) {
        return new BadRequestResponse("Reset password link has expired");
      }
      return new SuccessResponse({
        success: true,
        message: "Valid token",
      });
    } catch (error) {
      return new InternalServerError();
    }
  }
};
