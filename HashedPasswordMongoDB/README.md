# HashedPasswordMongoDB
## 🛡️ Secure User Authentication using BcryptJS and MongoDB (Node.js Backend)
This project demonstrates a simple and secure user authentication system using Node.js, Express, and MongoDB, where passwords are hashed using BcryptJS before storing them in the database. The frontend uses EJS for rendering dynamic templates.

---
## 📚 Features
User Signup and Login functionality

Password hashing with salting using bcryptjs

Clean separation of frontend and backend logic

Dynamic pages with EJS

MongoDB integration for user data

---

## 📦 Technologies Used
```
Node.js
Express.js
MongoDB + Mongoose
bcryptjs (for password hashing)
EJS (Embedded JavaScript templates)
Body-parser
HTML + basic CSS
```
---
## 🧠 Concepts Covered
Authentication: Verifying users with email and password

Password Hashing: One-way encryption using bcryptjs

Salting: Adds randomness to prevent precomputed attacks

Form Handling: Sending and processing POST requests

EJS Rendering: Serving dynamic HTML using Express and EJS

---
## 🛠️ Project Structure
```
hashed-auth/
│
├── app.js               # Main server logic
├── package.json         # Project dependencies
├── views/               # EJS templates
│   ├── home.ejs
│   ├── signup.ejs
│   ├── login.ejs
│   └── dashboard.ejs
└── README.md            # This file
```
---

## 🚀 Getting Started
1️⃣ Prerequisites
Ensure you have:

Node.js and npm installed

MongoDB running locally (default: mongodb://localhost:27017)

2️⃣ Installation
Clone the repo and install dependencies:
```
git clone /HashedPasswordMongoDB.git
cd HashedPasswordMongoDB
npm install
node app.js
```
---
## 🧪 How it Works
### ➕ Signup
User enters email and password.

Password is hashed with salt using bcryptjs.

Hashed password is stored in MongoDB.

### 🔐 Login
User submits credentials.

Password is hashed and compared to the stored hash.

If matched, user is granted access to dashboard.

---

### 🖼️ Interface Screens
Actual screenshots of each page.

<p align="center">
  <img src="https://github.com/hsj71/EncryptedPasswordMongoDB/blob/main/Screenshot%20(764).png" alt="View Merged PDFs" width="700"/>
</p>

<p align="center">
  <img src="https://github.com/hsj71/EncryptedPasswordMongoDB/blob/main/Screenshot%20(765).png" alt="View Merged PDFs" width="700"/>
</p>

<p align="center">
  <img src="https://github.com/hsj71/EncryptedPasswordMongoDB/blob/main/Screenshot%20(768).png" alt="View Merged PDFs" width="700"/>
</p>

<p align="center">
  <img src="https://github.com/hsj71/EncryptedPasswordMongoDB/blob/main/Screenshot%20(769).png" alt="View Merged PDFs" width="700"/>
</p>
--- 

## ⚙️ Security Notes
Passwords are never stored in plain text.

Uses bcryptjs with 10 salting rounds.

For production: Add express-session or JWT for session handling.

Always use environment variables for secrets, e.g.:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/hashedAuthDB
```
---

## 🧼 Sample UI Snippets
### home.ejs
```
<h1>Welcome</h1>
<a href="/signup">Signup</a> | <a href="/login">Login</a>
```
### signup.ejs
```
<h2>Signup</h2>
<form action="/signup" method="POST">
  <input type="email" name="email" required placeholder="Email">
  <input type="password" name="password" required placeholder="Password">
  <button type="submit">Register</button>
</form>
```
### login.ejs
```
<h2>Login</h2>
<form action="/login" method="POST">
  <input type="email" name="email" required placeholder="Email">
  <input type="password" name="password" required placeholder="Password">
  <button type="submit">Login</button>
</form>
```
### dashboard.ejs
```
<h1>Welcome to the Dashboard!</h1>
<p>You are successfully logged in.</p>
```
---

### 🧩 Example Code (app.js)
```
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();
const saltRounds = 10;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/hashedAuthDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => res.render("home"));
app.get("/signup", (req, res) => res.render("signup"));
app.get("/login", (req, res) => res.render("login"));

app.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = new User({ email: req.body.email, password: hashedPassword });
    await newUser.save();
    res.render("dashboard");
  } catch (err) {
    console.error(err);
    res.send("Signup error.");
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      res.render("dashboard");
    } else {
      res.send("Invalid credentials.");
    }
  } catch (err) {
    console.error(err);
    res.send("Login error.");
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
```
---
## ✍️ Author
Made by Hrishikesh
