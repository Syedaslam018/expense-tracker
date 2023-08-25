const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function getWebToken(id, name, boolSome) {
  return jwt.sign(
    { id: id, name: name, isPremiumUser: boolSome },
    process.env.SECRET_KEY
  );
}

exports.addUser = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, 10, async (err, hash) => {
      //console.log(err);
      const user = await new User({
        name: name,
        email: email,
        password: hash,
        isPremiumUser: false,
        totalExpenses: 0,
      });

      user.save();
      // await User.create({name: name, email: email, password: hash, totalExpenses: 0}, {transaction: t});
      res.status(201).json({ message: "user created succesfully", user: user });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: err });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const email = req.body.name;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404).json({ success: false, message: "user doesn't exist!" });
    } else {
      //   console.log(user);
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          throw new Error("Something Went Wrong");
        }
        if (result) {
          res.status(201).json({
            succes: true,
            message: "user logged in successfully",
            token: getWebToken(user.id, user.name, user.isPremiumUser),
          });
        }
        if (!result) {
          res
            .status(401)
            .json({ succes: false, message: "password incorrect!" });
        }
      });
    }
  } catch (e) {
    res.status(500).json({ message: e, succes: false });
  }
};
