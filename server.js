if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// loading modules
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/users');
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



initializePassport(
    passport,
    (email) => {
        User.findOne({ email: email }, (err, user) => {
            console.log(user);
        });
    },
    (id) => {
        User.findOne({ _id: id }, (err, user) => {
            console.log(user);
        });
    },
    // (email) => users.find(user => user.email === email),
    // (id) => users.find(user => user.id === id)
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
        return res.redirect('/auth/login');
    }
}
// public: static files and stylesheets
app.use('/public', express.static('public'));

// routes

app.get('/', (req, res) => {
    res.render('index.ejs', {
        title: "EAD Reviews"
    });
});

//route groups
app.use('/auth', authentication);


app.listen(process.env.PORT || 3000);