# 🔐 OAuthPasswordMongoDB

## 🔑 Secure Authentication with Google OAuth and Password using Node.js & MongoDB (Complete Backend)

This project demonstrates a **robust user authentication system** using **Node.js**, **Express**, and **MongoDB**, where users can sign in with either **Google OAuth** or a **local username/password combo**. The frontend is rendered using **EJS templates** and styled with basic CSS.

---

## 📚 Features

* 🔐 **Google OAuth 2.0 Authentication**
* 📧 Email and Password-based **Signup/Login**
* 🔄 Persistent sessions with `passport` and `express-session`
* ✅ User data stored in **MongoDB** with `mongoose`
* 💡 User secrets or protected content (sample dashboard)
* 🧱 Modular code structure (routes, config, models)

---

## 📦 Technologies Used

* **Node.js** + **Express.js**
* **MongoDB** + **Mongoose**
* **Passport.js** (Google + Local strategies)
* **EJS** templating engine
* **express-session** for session handling
* **dotenv** for environment variables
* **helmet** for added security

---

## 🧠 Concepts Covered

* **OAuth 2.0** with Google
* **Local Strategy Authentication**
* **Session Management** using Passport
* **User Serialization & Deserialization**
* **Routing Modularity** in Express
* **Rendering with EJS Templates**
* **Environment Variable Management**

---

## 🛠️ Project Structure

```
oauth-auth-app/
├── app.js                   # Main application entry point
├── .env                    # Environment variables
├── package.json            # Project metadata & dependencies
│
├── config/
│   └── passport-setup.js   # Passport strategy configuration
│
├── models/
│   └── User.js             # Mongoose user schema
│
├── routes/
│   ├── authRoutes.js       # Google OAuth routes
│   └── indexRoutes.js      # Local signup/login/logout routes
│
├── views/                  # EJS view templates
│   ├── home.ejs
│   ├── signup.ejs
│   ├── login.ejs
│   └── access.ejs
│
├── public/
│   └── styles.css          # Optional CSS styling
│
└── README.md               # This file
```

---

## 🚀 Getting Started

### 1️⃣ Prerequisites

* Node.js & npm
* MongoDB running locally (`mongodb://localhost:27017`)
* Google Developer Console account (create OAuth credentials)

### 2️⃣ Installation

```bash
git clone .../oauth-auth-app.git
cd oauth-auth-app
npm install
```

### 3️⃣ Setup `.env`

Create a `.env` file in the root directory:

```env
CLIENT_ID=your-google-client-id
CLIENT_SECRET=your-google-client-secret
SESSION_SECRET=someStrongRandomString
MONGO_URI=mongodb://localhost:27017/userDB
```

### 4️⃣ Run the App

```bash
node app.js
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🧑‍💻 Main Code Files

### `app.js`

```js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const indexRoutes = require("./routes/indexRoutes");

const app = express();

app.use(helmet());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true }
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI);
require("./config/passport-setup");

app.use("/", indexRoutes);
app.use("/auth", authRoutes);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
```

### `models/User.js`

```js
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  googleId: String,
  email: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);
```

### `config/passport-setup.js`

```js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(User.createStrategy());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, cb) => {
  User.findOrCreate({ googleId: profile.id }, (err, user) => {
    return cb(err, user);
  });
}));
```

### `routes/authRoutes.js`

```js
const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => res.redirect("/access")
);

module.exports = router;
```

### `routes/indexRoutes.js`

```js
const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const router = express.Router();

router.get("/", (req, res) => res.render("home"));
router.get("/signup", (req, res) => res.render("signup"));
router.get("/login", (req, res) => res.render("login"));
router.get("/access", (req, res) => {
  if (req.isAuthenticated()) res.render("access");
  else res.redirect("/login");
});
router.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/"));
});

router.post("/signup", (req, res) => {
  User.register({ username: req.body.username }, req.body.password, (err, user) => {
    if (err) return res.redirect("/signup");
    passport.authenticate("local")(req, res, () => res.redirect("/access"));
  });
});

router.post("/login", (req, res) => {
  const user = new User({ username: req.body.username, password: req.body.password });
  req.login(user, err => {
    if (err) return res.redirect("/login");
    passport.authenticate("local")(req, res, () => res.redirect("/access"));
  });
});

module.exports = router;
```

---

## 🎨 EJS Views (Minimal Example)

### `home.ejs`

```html
<h1>Welcome</h1>
<a href="/signup">Signup</a>
<a href="/login">Login</a>
<a href="/auth/google">Login with Google</a>
```

### `signup.ejs`

```html
<h1>Signup</h1>
<form action="/signup" method="POST">
  <input type="email" name="username" required>
  <input type="password" name="password" required>
  <button type="submit">Signup</button>
</form>
```

### `login.ejs`

```html
<h1>Login</h1>
<form action="/login" method="POST">
  <input type="email" name="username" required>
  <input type="password" name="password" required>
  <button type="submit">Login</button>
</form>
<a href="/auth/google">Login with Google</a>
```

### `access.ejs`

```html
<h1>Welcome to Dashboard</h1>
<p>You are logged in!</p>
<a href="/logout">Logout</a>
```

---

## ✍️ Author

Made by **Hrishikesh**
