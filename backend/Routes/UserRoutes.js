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

router.get("/logout", (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("Logout");
});

// const streamUrl = "http://192.168.0.103:4747/video";
// router.get("/cam1", (req, res) => {
//   http.get(streamUrl, (stream) => {
//     stream.pipe(res);
//   });
// });

// router.get("/video", (req, res) => {
//   fetch("http://192.168.0.103:4747/video")
//     .then((r) => r.body)
//     .then((s) => {
//       s.pipe(res);
//     })
//     .catch((e) => {
//       res.status(500).send("Error.");
//     });
// });

router.get("/cam1", (req, res) => {
  res.redirect("http://192.168.0.103:4747/video");
});

router.get("/cam2", (req, res) => {
  res.redirect("http://103.145.35.162:91/mjpg/video.mjpg");
});

// router.get("/video", (req, res) => {
//   const range = req.headers.range;
//   const streamUrl = "http://192.168.0.103:4747/video";

//   const chunkSize = 1 * 1e6;
//   const start = 0;
//   const end = start + chunkSize;

//   const headers = {
//     "Content-Range": `bytes ${start}-${end}`,
//     "Accept-Ranges": "bytes",
//     "Content-Length": contentLength,
//     "Content-Type": "video/mp4",
//   };
//   res.writeHead(206, headers);

//   const stream = fs.createReadStream(streamUrl, { start, end });
//   stream.pipe(res);
// });

module.exports = router;
