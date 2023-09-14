const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");

const AttendanceSchema = new Schema({
  customer_code: {
    type: Number,
    required: true
  },
  attendance_date: {
    type: Date,
    required: true
  },
  created_date: {
    type: Date,
    default: Date.now(),
  },
});

AttendanceSchema.plugin(uniqueValidator, { message: "attendance date already added." });

const Attendance = mongoose.model("attendance", AttendanceSchema);
module.exports = Attendance;
