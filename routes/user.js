const express = require("express");
// const app = express();
const router = express.Router();
const User = require("../model/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
const { render } = require("ejs");

//for signup
router
  .route("/signup")
  .get(userController.renderSignup)
  .post( wrapAsync(userController.signup));

//for login
router
  .route("/login")
  .get( userController.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

// for logout
router.get("/logout", userController.logout);
module.exports = router;
