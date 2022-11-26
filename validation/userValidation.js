const { ValidationError } = require("../errors/user");
const {
  User,
  userJoiSchema,
  subscriptionJoiSchema,
} = require("../schemas/User");

const validateUser = async (req, res, next) => {
  const { body } = req;
  const { error } = userJoiSchema.validate(body);
  const userModel = new User(body);

  try {
    await userModel.validate();
  } catch (error) {
    const errorProperty = Object.keys(error.errors).join("");
    const errorMessage = error.errors[errorProperty].properties.message;
    return next(new ValidationError(errorMessage));
  }

  if (error) {
    const [details] = error.details;
    return next(new ValidationError(details.message));
  }

  next();
};

const subscribtionValidate = async (req, res, next) => {
  const { body } = req;
  const { error } = subscriptionJoiSchema.validate(body);

  if (error) {
    const [details] = error.details;
    return next(new ValidationError(details.message));
  }

  next();
};

module.exports = { validateUser, subscribtionValidate };