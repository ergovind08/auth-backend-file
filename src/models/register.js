const mongoose = require("mongoose");

const sch = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phonenumber: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  // confirmpassword: {
  //   type: String,
  //   required: true,
  // },
});

const User = new mongoose.model("User", sch);

module.exports = User;
