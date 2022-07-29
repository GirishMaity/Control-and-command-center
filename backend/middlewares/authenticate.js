const jwt = require("jsonwebtoken");
const User = require("../Models/UserSchema");

const authenticate = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    token = token.split(" ")[1];
    const verify = jwt.verify(token, process.env.SECRET_KEY);

    var rootUser = await User.findOne({
      _id: verify._id,
      "tokens.token": token,
    });

    if (!rootUser) {
      throw new Error("User now found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;

    next();
  } catch (error) {
    res.status(400).json({ error: "Unauthorised user." });
    console.log(error);
  }
};

module.exports = authenticate;
