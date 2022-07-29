const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      cameraname: {
        type: String,
        required: false,
      },
      ipaddress: {
        type: String,
        required: false,
      },
    },
  ],
});

schema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }

  next();
});

schema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    console.log(error);
  }
};

schema.methods.addNewCamera = async function (cameraname, ipaddress) {
  try {
    this.cams = this.cams.concat({
      cameraname: cameraname,
      ipaddress: ipaddress,
    });
    await this.save();
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const User = mongoose.model("User", schema);

module.exports = User;
