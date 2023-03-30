import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import passport from "passport";
import {
  ensureAuthenticated,
  ensureNotAuthenticated,
} from "../utils/authentication.js";

const router = express.Router();

router.get("/login", ensureNotAuthenticated, (req, res) => {
  res.render("login", {
    pageTitle: "Login",
    successMsg: req.flash("successMsg"),
    errorMsg: req.flash("error"),
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);

router.get("/register", ensureNotAuthenticated, (req, res) => {
  res.render("register", {
    pageTitle: "Register",
  });
});

router.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  let errorMsg;
  if (password !== confirmPassword) {
    errorMsg = "Passwords do not match";
  }
  if (!errorMsg && (await User.findOne({ email }))) {
    errorMsg = "The email is already registered";
  }

  if (errorMsg) {
    res.render("register", {
      pageTitle: "Register",
      name,
      email,
      password,
      confirmPassword,
      errorMsg,
    });
  } else {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        name,
        email,
        password: hashedPassword,
      });
      req.flash("successMsg", "Registration successful");
      res.redirect("/users/login");
    } catch (err) {
      console.log(err);
    }
  }
});

router.post("/logout", ensureAuthenticated, (req, res) => {
  req.logout(() => res.redirect("/users/login"));
});

export default router;