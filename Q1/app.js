const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");

const app = express();

mongoose.connect("mongodb://0.0.0.0:27017/registration");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("uploads"));
app.use("/uploads", express.static("uploads"));

app.use("/", userRoutes);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
