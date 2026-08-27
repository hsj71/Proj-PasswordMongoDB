const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/mydb1");

// Create user schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// Secret key for encryption (should be stored in environment variable in production)
const secret = "ThisIsASecretKey";
userSchema.plugin(encrypt, {
  secret: secret,
  encryptedFields: ["password"],
});

// User model
const User = mongoose.model("User", userSchema);

// Routes
app.get("/", (req, res) => res.render("home"));

app.get("/signup", (req, res) => res.render("signup"));

app.get("/login", (req, res) => res.render("login"));

app.post('/signup', async (req, res) => {
    try {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });
        await newUser.save();
        res.render("access");
    } catch (err) {
        console.error(err);
        res.send("Error signing up.");
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const foundUser = await User.findOne({ email: username });
        if (foundUser && foundUser.password === password) {
            res.render("access");
        } else {
            res.send("Invalid credentials.");
        }
    } catch (err) {
        console.error(err);
        res.send("Error logging in.");
    }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
