const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string()
    .pattern(/[A-Za-z]\s/)
    .min(2)
    .max(30)
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.string().pattern(/^\d+$/).min(10).max(14).required(),
  favorite: Joi.string(),
});

const bodyValidate = async (req, res, next) => {
  const { error, value: body } = schema.validate(req.body);

  if (!Object.keys(body).length) {
    return res.status(400).json({ message: "missing fields" });
  }

  if (error) {
    const [details] = error.details;
    return res.status(400).json({ message: details.message });
  }

  next();
};

module.exports = { bodyValidate };