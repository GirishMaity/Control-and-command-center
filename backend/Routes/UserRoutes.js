const express = require("express");
const connectDB = require("../DB/db");
const router = express.Router();

connectDB();
const User = require("../Models/UserSchema");

router.get("/", (req, res) => {
  res.send("api running");
});

router.post("/register", async (req, res) => {
  const { name, email, password, cpassword } = req.body;

  if (!name || !email || !password || !cpassword) {
    return res.status(400).json({ error: "Invalid Credentials" });
  } else {
    if (password === cpassword) {
      try {
        const newUser = new User({
          name,
          email,
          password,
          cpassword,
        });

        await newUser.save();

        return res.status(201).json({ message: "User created successfully." });
      } catch (error) {
        console.log(error.message);
      }
    } else {
      return res.status(400).json({ error: "Invalid Credentials." });
    }
  }

  res.json({
    error: "There was an internal error.",
  });
});

module.exports = router;
