const app = require("./app");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
require("dotenv").config();

async function connect() {
  await mongoose.connect(process.env.DB_HOST, {
    useNewUrlParser: true,
  });
  app.listen(3000, () => {
    console.log("Server running. Use our API on port: 3000");
  });
}

connect()
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });