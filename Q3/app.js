const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Use cookie-parser middleware

// Connection -(2)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongooDb connected");
  })
  .catch((err) => {
    console.log("Error while connecting with MongoDb : " + err);
  });

// Set EJS - (3)
app.set("view engine", "ejs");

// Define Routes (8)
// const userRoutes = require("./routes/userRoutes");
app.use("/user", userRoutes);

//  Check server (1)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server is running on PORT:" + PORT);
});
