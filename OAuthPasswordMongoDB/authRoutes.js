const express = require("express");
const router = express.Router();
const passport = require("passport");

// Google Auth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", {
  failureRedirect: "/login"
}), (req, res) => {
  res.redirect("/access");
});

module.exports = router;
