const express = require("express");
const connectDB = require("../DB/db");
const router = express.Router();
//const got = require("got");
const http = require("http");

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

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please fill all the fields." });
  }

  try {
    const emailExist = await User.findOne({ email: email });

    if (!emailExist) {
      return res.status(400).json({ error: "Email not found" });
    }

    const isMatch = await User.findOne({ password: password });

    if (isMatch) {
      return res.status(200).json({ message: "User login successfully." });
    } else {
      return res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

const streamUrl = "http://192.168.0.103:4747/video";
router.get("/video", (req, res) => {
  http.get(streamUrl, (stream) => {
    stream.pipe(res);
  });
});

module.exports = router;
