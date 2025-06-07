const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel");

// when you will be accessing profile route it will check whether you have token in cookie or not
// agr h toh jane dega wrna nhi jane dega

const checkForAuthentication = async (req, res, next) => {
  const { token } = req.cookies;
  //valdiation
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "UnAuthorized User",
    });
  }
  const decodeData = JWT.verify(token, process.env.JWT_SECRET);
  req.user = await userModel.findById(decodeData._id);
  next();
};

const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(401).send({
      success: false,
      message: "admin only",
    });
  }
  next();
};

module.exports = {
  checkForAuthentication,
  isAdmin,
};