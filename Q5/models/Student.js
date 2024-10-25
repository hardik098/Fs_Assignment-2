const mongoose = require("../configs/dbConnection");

const StudentSchema = mongoose.Schema({
  rno: { type: Number, unique: true },
  name: String,
  sem: String,
  age: Number,
  gender: String,
  email: { type: String, unique: true },
  password: String,
});

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
