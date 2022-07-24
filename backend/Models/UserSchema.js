const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: false,
      },
    },
  ],
  cams: [
    {
      ip: {
        type: String,
        required: false,
      },
    },
  ],
});

const User = mongoose.model("User", schema);

module.exports = User;
