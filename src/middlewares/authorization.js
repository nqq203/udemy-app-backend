const jwt = require("jsonwebtoken");
const User = require("../models/users");
const {
  AuthFailureResponse,
  ForbiddenResponse,
  InternalServerError,
} = require("../common/error.response");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.send(new AuthFailureResponse("Access denied").responseBody());
    }
    let verified;
    try {
      verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      res.send(new AuthFailureResponse('Invalid token'));
    }

    req.user = verified;
    next();
  } catch (err) {
    console.log(err);
    res.send(new InternalServerError('Internal server error'));
  }
};

const checkRoles = (roles) => {
  return (req, res, next) => {
    const { user } = req;
    if (roles.indexOf(user.role) !== -1) {
      next();
    } else {
      console.log("Forbidden");
      res.send(new ForbiddenResponse('Invalid token').responseBody());
    }
  };
};
module.exports = {
  verifyToken,
  checkRoles,
};
