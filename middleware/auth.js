const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

exports.authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  const user = jwt.verify(token, process.env.SECRET_KEY);
  User.findById(user.id)
    .then((user) => {
      if (!user) {
        res.status(401).json({ success: false, message: "User Not Found" });
      } else {
        req.user = user;
        next();
      }
    })
    .catch((err) => console.log(err));
};
