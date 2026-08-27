const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();
const saltRounds = 10;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/mydb2", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema & Model
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

// Routes
app.get("/", (req, res) => res.render("home"));
app.get("/signup", (req, res) => res.render("signup"));
app.get("/login", (req, res) => res.render("login"));

// Signup Route
app.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const user = new User({ email: req.body.email, password: hashedPassword });
    await user.save();
    res.render("access");
  } catch (err) {
    console.error("Signup Error:", err);
    res.send("Error during signup");
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      res.render("access");
    } else {
      res.send("Invalid email or password.");
    }
  } catch (err) {
    console.error("Login Error:", err);
    res.send("Error during login");
  }
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
