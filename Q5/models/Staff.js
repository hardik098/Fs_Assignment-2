const mongoose = require("../configs/dbConnection");

const StaffSchema = mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
});

const Staff = mongoose.model("Staffs", StaffSchema);

module.exports = Staff;
