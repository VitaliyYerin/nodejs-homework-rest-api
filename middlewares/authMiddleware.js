const { UnauthorizedError } = require("../errors/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../schemas/User");

const authMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(new UnauthorizedError("Not authorized"));
  }
  // eslint-disable-next-line no-unused-vars
  const [_, token] = req.headers.authorization.split(" ");
  try {
    const { _id: id } = jwt.verify(token, process.env.AUTH_SECRET);
    const user = await User.findById(id);
    if (!user || token !== user.token) {
      return next(new UnauthorizedError("Not authorized"));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new UnauthorizedError("Not authorized"));
  }
};

module.exports = {
  authMiddleware,
};