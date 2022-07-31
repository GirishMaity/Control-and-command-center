const express = require("express");
const connectDB = require("../DB/db");
const router = express.Router();
//const got = require("got");
const http = require("http");
const fs = require("fs");
const fetch = require("node-fetch");
const bcrypt = require("bcrypt");

connectDB();
const User = require("../Models/UserSchema");
const authenticate = require("../middlewares/authenticate");
const { userInfo } = require("os");

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
        const result = await User.findOne({ email: email });

        if (result) {
          return res.status(400).json({ error: "Email already exists." });
        }

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
      return res.status(400).json({ error: "Invalid Credentials." });
    }

    const isMatch = await bcrypt.compare(password, emailExist.password);

    const token = await emailExist.generateAuthToken();

    if (isMatch) {
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 2592000000),
        httpOnly: true,
      });

      return res.status(200).json({ token: token });
    } else {
      return res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/authenticate", authenticate, async (req, res) => {
  res.send(req.rootUser);
});

router.post("/addcamera", authenticate, async (req, res) => {
  const { cameraname, ipaddress } = req.body;

  if (!cameraname || !ipaddress) {
    return res.status(400).json({ error: "Please fill the form properly" });
  }

  try {
    const rootUser = req.rootUser;

    const isSaved = await rootUser.addNewCamera(cameraname, ipaddress);

    if (isSaved) {
      return res
        .status(200)
        .json({ message: "Successfully added the camera." });
    } else {
      return res.status(400).json({ error: "Could not save the camera." });
    }
  } catch (error) {
    console.log(error);
  }

  return res.status(400).json({ error: "An unknown error occured." });
});

router.post("/showcamera", authenticate, async (req, res) => {
  const { cameraname } = req.body;

  // if (!cameraname) {
  //   return res.status(400).json({ error: "Please fill the form properly" });
  // }

  try {
    const rootUser = req.rootUser;

    const user = await User.findOne({
      email: rootUser.email,
    }).select({ cams: { $elemMatch: { cameraname: cameraname } } });
    // var arr = [];
    // for (var i = 0; i < user.cams.length; i++) {
    //   arr[i] = user.cams[i].ipaddress;
    //   console.log(user.cams[i].ipaddress);
    // }

    const ip = user.cams[0].ipaddress;

    if (user) {
      return res.status(200).json({ ip });
    } else {
      return res.status(400).json({ error: "could not fine the camera" });
    }
  } catch (error) {
    console.log(error);
  }

  return res.status(400).json({ error: "An unknown error occured." });
});

router.get("/showall", authenticate, async (req, res) => {
  try {
    const rootUser = req.rootUser;
    const user = await User.find(
      { email: rootUser.email },
      { cams: { ipaddress: 1 } }
    );
    // const user = await User.findOne({
    //   "cams.ipaddress": { $elemMatch: { email: rootUser.email } },
    // });

    res.json(user);
  } catch (error) {}
});

router.get("/logout", (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("Logout");
});

router.get("/cam1", (req, res) => {
  res.redirect("http://192.168.0.103:4747/video");
});

router.get("/cam2", (req, res) => {
  res.redirect("http://103.145.35.162:91/mjpg/video.mjpg");
});

module.exports = router;
