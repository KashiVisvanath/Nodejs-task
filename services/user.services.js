const User = require("../models/user.model");
const Attendance = require("../models/attendance.model");
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/auth.js");
const crypto = require("crypto");
const key = "verysecretkey"; // Key for cryptograpy. Keep it secret
const moment = require("moment");

async function login({ customer_code, password }, callback) {
  const user = await User.findOne({ customer_code });

  if (user != null) {
    if (bcrypt.compareSync(password, user.password)) {
      const token = auth.generateAccessToken({ customer_code, name: user.name });
      // call toJSON method applied during model instantiation
      return callback(null, { ...user.toJSON(), token });
    } else {
      return callback({
        message: "Invalid customer_code/Password!",
      });
    }
  } else {
    return callback({
      message: "Invalid Username/Password!",
    });
  }
}

async function register(params, callback) {
  if (params.name === undefined) {
    console.log(params.name);
    return callback(
      {
        message: "name Required",
      },
      ""
    );
  }

  const user = new User(params);
  user
    .save()
    .then((response) => {
      return callback(null, response);
    })
    .catch((error) => {
      return callback(error);
    });
}

async function addAttendance(params, callback) {
  if (params.customer_code === undefined) {
    console.log(params.name);
    return callback(
      {
        message: "customer_code Required",
      },
      ""
    );
  }

  const user = new Attendance(params);
  user
    .save()
    .then((response) => {
      return callback(null, response);
    })
    .catch((error) => {
      return callback(error);
    });
}

async function report(callback) {
  console.log(moment().add(-10, "days"));
  const userReport = await User.aggregate([
    {
      $lookup:
      {
        from: "attendances",
        localField: "customer_code",
        foreignField: "customer_code",
        as: "user_report"
      }
    }, {
      $match: {
        $or: [
          {"user_report" : []},
          { "user_report.attendance_date": { $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000) } }
        ]
      }
    },
    {
      $project : {
        _id : 0,
        customer_code : 1,
        name : 1,
        designation : 1,
        basic_salary : 1,
        user_report : {
          attendance_date : 1
        }
      }
    }
  ])



  if (userReport != null) {
    return callback(null, userReport);
  } else {
    return callback({
      message: "Data not found!",
    });
  }
}

async function deleteUserAccount(params , callback) {
  const user = await User.findOne({ customer_code : params.customer_code });

  if (user != null) {
    const delete_user = await User.deleteOne({ customer_code : params.customer_code });
    return callback(null,{
      message: "User Account Deleted Successfully!",
    });
  } else {
    return callback({
      message: "Account not found!",
    });
  }
}

module.exports = {
  login,
  register,
  addAttendance,
  report,
  deleteUserAccount
};
