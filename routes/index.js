const express = require("express");
const router = express.Router();
const users = require("../controller/users");
const messages = require("../controller/messages");
const { isLoggedIn, isAdmin } = require("../middleware");
const { check } = require("express-validator");

router.route("/").get(messages.showMessages);
router.route("/register").get(users.renderRegister).post(users.register);

router
  .route("/login")
  .get(users.renderLogin)
  .post(users.loginAuthenticate, users.login);
router.route("/logout").get(users.logout);

router
  .route("/messages/new")
  .get(isLoggedIn, messages.renderNewForm)
  .post(isLoggedIn, messages.createMessage);

router.delete("/messages/:id", isLoggedIn, isAdmin, messages.deleteMessage);

router
  .route("/getAdmin")
  .get(isLoggedIn, users.renderAdminForm)
  .post(isLoggedIn, users.getAdmin);

router.route("/users").get(isLoggedIn, isAdmin, users.showUsers);
router.route("/users/:id").delete(isLoggedIn, isAdmin, users.deleteUser);

module.exports = router;
