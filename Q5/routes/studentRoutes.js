const Student = require("../models/Student");
const Staff = require("../models/Staff");
const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const auth = require("../middlewares/authMiddleware");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const sessionAuth = require("../middlewares/sessionMiddleware");

router.get("/", (req, res) => {
  res.render("register");
});

// Login Routes
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  Staff.findOne({ email: email })
    .then((data) => {
      if (!data) {
        return res.status(401).json({ message: "User not found!" });
      }
      if (data.password === password) {
        const token = jwt.sign(
          { id: data._id, email: data.email },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.cookie("token", token, { httpOnly: true });
        console.log("Admin login successfull");
        //res.redirect("/list");
        res.status(200).send("Admin login successful");
      } else return res.status(401).json({ message: "Invalid password!" });
    })
    .catch((err) => {
      console.log("Login failed :", err);
      return res.status(401).json({ message: "Login failed" + err });
    });
});

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Email must be in proper format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must conatin min six letters"),
  ],
  (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .send("Error in registartion, please check your inputs!");
    }

    const newStudent = new Student(req.body);
    newStudent
      .save()
      .then(() => {
        console.log("Student registered successfully");
        //res.status(200).send("Student registered successfully");
        return res.render("login");
      })
      .catch((err) => {
        console.log("Error inserting student : " + err);
      });
  }
);

//  list

router.get("/list", sessionAuth, (req, res) => {
  const { search, sortBy, order, gender, semester } = req.query;
  let query = {};

  // Search by name or email
  if (search) {
    query = {
      $or: [
        { name: { $regex: search, $options: "i" } }, // Case-insensitive search for name
        { email: { $regex: search, $options: "i" } }, // Case-insensitive search for email
      ],
    };
  }

  // Filter by gender
  if (gender) {
    query.gender = gender;
  }

  // Filter by semester
  if (semester) {
    query.sem = semester;
  }

  // Sorting logic
  let sort = {};
  if (sortBy) {
    // If sortBy has a value, create a sort object
    if (order === "desc") {
      sort[sortBy] = -1;
    } else {
      sort[sortBy] = 1; // Ascending order (default)
    }
    console.log(sort); // { name: -1 }
  }

  Student.find(query)
    .sort(sort)
    .then((students) => {
      console.log("Student list fetched successfully");
      return res.render("list", { students: students, query });
    })
    .catch((err) => {
      console.log("Error fetching student list : " + err);
    });
});

//delete

router.get("/delete/:id", auth, (req, res) => {
  Student.findOneAndDelete({ _id: req.params.id })
    .then(() => {
      console.log("Student deleted!");
      res.redirect("/list");
    })
    .catch((err) => {
      console.log("Error deleting student : " + err);
    });
});

// Edit
router.get("/edit/:id", auth, (req, res) => {
  Student.findById({ _id: req.params.id })
    .then((s) => {
      console.log("Edit request granted for student id ", req.params.id);
      return res.render("edit", { s: s });
    })
    .catch((err) => {
      console.log("Error updating student : " + err);
    });
});

router.post(
  "/edit/:id",
  auth,
  [
    body("email").isEmail().withMessage("Email must be in proper format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must conatin min six letters"),
  ],
  (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .send(
          "Error in updating student, please check your inputs!" +
            errors.array()
        );
    }

    Student.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
      .then(() => {
        console.log("Student updated successfully");
        //res.status(200).json({ message: "Student updated successfully" });
        return res.redirect("/list");
      })
      .catch((err) => {
        console.log("Error inserting student : " + err);
      });
  }
);

//  Manage session
router.get("/loginSession", (req, res) => {
  res.render("loginSession");
});

router.post("/loginSession", (req, res) => {
  const { email, password } = req.body;
  Staff.findOne({ email: email })
    .then((data) => {
      if (!data) {
        return res.status(401).json({ message: "User not found!" });
      }
      if (data.password === password) {
        req.session.user = {
          id: data._id,
          email: data.email,
        };
        return res.status(200).redirect("/list"); // or res.send("Login successful")
      } else {
        return res.status(401).json({ message: "Invalid password!" });
      }
    })
    .catch((err) => {
      console.log("Failed to login :" + err);
      return res.status(401).json({ message: "Failed to login" });
    });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
