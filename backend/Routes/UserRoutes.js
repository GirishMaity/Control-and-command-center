const express = require("express");
const connectDB = require("../DB/db");
const router = express.Router();
//const got = require("got");
const http = require("http");
const fs = require("fs");
const fetch = require("node-fetch");

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
