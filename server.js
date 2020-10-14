if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// loading modules
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const initializePassport = require('./passport-config');
const authentication = require('./routes/authentication');

//connecting to database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("MongoDB Atlas connected!")
}).catch((err) => {
    console.log("Database connection error:" + err)
});

//Database Schema and models
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);


initializePassport(
    passport,
    (email) => users.find(user => user.email === email),
    (id) => users.find(user => user.id === id)
);

// Configurations
// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// ejs
app.set('view-engine', 'ejs');
// session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(methodOverride('_method'));

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/login');
    }
}
// routes

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name });
});

app.use('/auth', authentication);


app.listen(process.env.PORT || 3000);