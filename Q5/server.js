const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();

const studentRoutes = require("./routes/studentRoutes");

//const conn = require("./configs/dbConnection");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { secure: false, maxAge: 36000 },
  })
);

app.set("view engine", "ejs");

app.use("/", studentRoutes);

app.listen(process.env.PORT || 4000, () => {
  console.log("Server is running on PORT:", process.env.PORT);
});
