const asyncWrapper = (controller) => {
  return (req, res, next) => {
    controller(req, res, next).catch(() => {
      res.status(500).json({ message: "Server error" });
    });
  };
};

module.exports = { asyncWrapper };