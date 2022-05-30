const User = require("../models/User");
const Message = require("../models/Message");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { check, body, validationResult } = require("express-validator");
require("dotenv").config();

module.exports.renderRegister = async (req, res) => {
  res.status(200).render("users/register");
};

module.exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("users/register", {
      errors: errors.array(),
      success: [],
      user: res.locals.currentUser,
    });
  }
  const { username, password, cpassword } = req.body;
  if (password !== cpassword) {
    req.flash("error", "Passwords do not match");
    return res.status(401).redirect("/register");
  }
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    const user = new User({
      username: username,
      password: hashedPassword,
    }).save((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", `Welcome! ${req.body.username}`);
      res.redirect("/login");
    });
  });
};

module.exports.renderLogin = async (req, res) => {
  res.status(200).render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", `Welcome Back! ${req.body.username}`);
  res.redirect("/");
};

module.exports.loginAuthenticate = passport.authenticate("local", {
  failureFlash: true,
  failureRedirect: "/login",
});

// async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await User.findOne({ username });
//     if (!user) res.redirect("/login");
//     bcrypt.compare(password, user.password, (err, result) => {
//       if (result) {
//         // passwords match! log user in
//         res.redirect("/messages");
//       } else {
//         // passwords do not match!
//         res.redirect("/login");
//       }
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

module.exports.logout = async (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.status(200).redirect("/");
};

module.exports.renderAdminForm = async (req, res) => {
  res.status(200).render("users/getAdmin");
};
module.exports.getAdmin = async (req, res) => {
  const id = res.locals.currentUser._id;
  const code = req.body.code;
  if (code === process.env.CODE) {
    await User.findByIdAndUpdate(id, { admin: true });
    req.flash("success", "You are now ADMIN!");
    res.status(200).redirect("/");
  } else {
    req.flash("error", "Wrong code!");
    res.status(200).redirect("/getAdmin");
  }
};

module.exports.showUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: res.locals.currentUser._id } });
    res.status(200).render("users/showUsers", { users });
  } catch (err) {
    res.status(500).json(err);
  }
};
module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    await Message.deleteMany({ user: id });
    req.flash("success", "User deleted!");
    res.status(200).redirect("/users");
  } catch (err) {
    res.status(500).json(err);
  }
};
