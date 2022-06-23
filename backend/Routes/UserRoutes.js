const express = require("express");
const connectDB = require("../DB/db");
const router = express.Router();

connectDB();
const User = require("../Models/UserSchema");

router.get("/", (req, res) => {
  res.send("api running");
});

module.exports = router;
