const { User } = require("../schemas/User");
const bcrypt = require("bcrypt");
const { ConflictError } = require("../errors/user");
const { login } = require("../service/usersService");

const registrateUser = async (req, res, next) => {
  const { body } = req;
  const { email, password } = body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new ConflictError("Email in use"));
  }

  bcrypt.hash(password, 10, async function (_err, hash) {
    const { email, subscription } = await User.create({
      ...body,
      password: hash,
    });

    res
      .status(201)
      .json({ message: "user created", user: { email, subscription } });
  });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const {
      user: { email: userEmail, subscription },
      token,
    } = await login(email, password);

    res.json({ token, user: { email: userEmail, subscription } });
  } catch (error) {
    return next(error);
  }
};

const logoutUser = async (req, res, next) => {
  const { user } = req;
  await User.findByIdAndUpdate(user._id, { token: null });
  res.status(204);
};

const currentUser = async (req, res, next) => {
  const {
    user: { email, subscription },
  } = req;

  res.json({ email, subscription });
};

const updateSubscribtion = async (req, res, next) => {
  const { body, user } = req;
  const newUser = await User.findByIdAndUpdate(
    user._id,
    {
      subscription: body.subscription,
    },
    { new: true }
  );

  res.json({
    message: "success update subscription",
    data: { user: { _id: newUser._id, subscription: newUser.subscription } },
  });
};

module.exports = {
  currentUser,
  registrateUser,
  loginUser,
  logoutUser,
  updateSubscribtion,
};