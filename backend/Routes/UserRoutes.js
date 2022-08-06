const express = require("express");
const connectDB = require("../DB/db");
const router = express.Router();
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
  const { cameraname, ipaddress, address } = req.body;

  if (!cameraname || !ipaddress || !address) {
    return res.status(400).json({ error: "Please fill the form properly" });
  }

  try {
    const rootUser = req.rootUser;

    const isSaved = await rootUser.addNewCamera(cameraname, ipaddress, address);
    console.log(`isSaved: ${isSaved}`);

    if (isSaved) {
      return res
        .status(200)
        .json({ message: "Successfully added the camera.", data: isSaved });
    } else {
      return res
        .status(400)
        .json({ error: "Could not save the camera.", data: isSaved });
    }
  } catch (error) {
    console.log(error);
  }

  return res.status(400).json({ error: "An unknown error occured." });
});

router.post("/showcamera", authenticate, async (req, res) => {
  const { cameraname } = req.body;

  try {
    const rootUser = req.rootUser;

    const user = await User.findOne({
      email: rootUser.email,
    }).select({ cams: { $elemMatch: { cameraname: cameraname } } });

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
      { cams: { cameraname: 1, ipaddress: 1 } }
    );

    res.json(user);
  } catch (error) {}
});

router.get("/logout", (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("Logout");
});

module.exports = router;
