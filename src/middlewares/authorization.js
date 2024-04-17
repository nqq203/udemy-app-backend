const jwt = require("jsonwebtoken");
const moment = require("moment");
const sessionConstant = require("../constants/session.constant");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types
const User = require("../models/users");
const Session = require("../models/sessions");
const {
  AuthFailureResponse,
  ForbiddenResponse,
  InternalServerError,
} = require("../common/error.response");
const _ = require("lodash");

const verifyToken = async (req, res, next) => {
  try {
    // console.log(req.headers);
    const token = req.headers["authorization"]?.split(" ")[1];
    // const token = req.headers["authorization"];
    // console.log("hello" + token);

    if (!token) {
      return res.send(new AuthFailureResponse("Invalid token").responseBody());
    }
    
    try {
      const {sessionId, userId} = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const session = await Session.findById(sessionId);
      
      if (!session) {
        return res.send(new AuthFailureResponse("Invalid token").responseBody());
      }
      if (session && session.expiredAt < moment()) {
        return res.send(new AuthFailureResponse("Invalid token").responseBody());
      }
      if (session.status !== sessionConstant.STATUS_TOKEN.ACTIVE) {
        return res.send(new AuthFailureResponse("Invalid token").responseBody());
      }
      if (session && String(session.userId) !== userId) {
        return res.send(new AuthFailureResponse("Invalid token").responseBody());
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.send(new AuthFailureResponse("Invalid token").responseBody());
      }
      req.session = session;
      req.user = user;

      next();
    } catch (err) {
      res.send(new AuthFailureResponse('Invalid token'));
    }

  } catch (err) {
    console.log(err);
    res.send(new InternalServerError('Internal server error'));
  }
};

const checkRoles = (roles) => {
  return (req, res, next) => {
    const { user } = req; //req.user
    console.log(user)
    if (roles.indexOf(user.role) !== -1) {
      next();
    } else {
      console.log("Forbidden");
      res.send(new ForbiddenResponse('Forbidden').responseBody());
    }
  };
};
module.exports = {
  verifyToken,
  checkRoles,
};
