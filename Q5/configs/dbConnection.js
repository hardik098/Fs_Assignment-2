const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected with MongoDb");
  })
  .catch((err) => {
    console.log("Error connectiong with MongoDb :" + err);
  });

module.exports = mongoose;
