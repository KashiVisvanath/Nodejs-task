const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  customer_code: {
    type: Number,
    default: 0,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  basic_salary: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

/**
 *  Here we are creating and setting an id property and 
    removing _id, __v, and the password hash which we do not need 
    to send back to the client.
 */
UserSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    //do not reveal passwordHash
    delete returnedObject.password;
  },
});


UserSchema.plugin(uniqueValidator, { message: "name already in use." });
UserSchema.plugin(autoIncrement.plugin, {
    model: 'user',
    field: 'customer_code',
    startAt: 1101,
    incrementBy: 1
  });


const User = mongoose.model("user", UserSchema);
module.exports = User;
