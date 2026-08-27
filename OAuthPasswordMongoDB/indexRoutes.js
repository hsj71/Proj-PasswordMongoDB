const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", (req, res) => res.render("home"));
router.get("/login", (req, res) => res.render("login"));
router.get("/signup", (req, res) => res.render("signup"));
router.get("/access", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("access");
  } else {
    res.redirect("/login");
  }
});
router.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/"));
});

module.exports = router;
