if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// loading modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const { User, userSchema } = require("./models/users");
const Course = require("./models/courses");

const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

const initializePassport = require("./passport-config");

const authentication = require("./routes/authentication");
const adminAccess = require("./routes/admin-access");

//connecting to database
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Atlas connected!");
  })
  .catch((err) => {
    console.log("Database connection error:" + err);
  });

// retreiving data from DB for authentication
async function getUserByEmail(email) {
  const user = await User.findOne({ email: email }).exec();
  return user;
}
async function getUserById(id) {
  const user = await User.findOne({ _id: id }).exec();
  return user;
}

//passport config
initializePassport(passport, getUserByEmail, getUserById);

// Configurations

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// ejs
app.set("view-engine", "ejs");
// session.
// no futuro os dados das sessions dos usuários aumentam e precisarão de uma DB. Usar connect-mongo (a MongoDB-based session store) para conectar à mesma DB atual, usada p/ o resto das coisas.
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// to change POST to DELETE on logout form
app.use(methodOverride("_method"));

app.use((req, res, next) => {
  // to make authentication property available
  res.locals.isAuthenticated = req.isAuthenticated();
  //to make req.flash available - not working
  // res.locals.flashMessages = req.flash();
  next();
});

//?
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect("/auth/login");
  }
}
// public: static files and stylesheets
app.use("/public", express.static("public"));

// routes

app.get("/", (req, res) => {
  res.render("index.ejs", {
    title: "EAD Reviews",
  });
});

//route groups
app.use("/auth", authentication);
app.use("/admin", adminAccess);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port: ${process.env.PORT || 3000}`);
});
