if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
// const { urlencoded } = require('express');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const initializePassport = require('./passport-config');

initializePassport(
    passport,
    (email) => users.find(user => user.email === email),
    (id) => users.find(user => user.id === id)
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view-engine', 'ejs');
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'));

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name });
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
});

const users = [];

// app.get('/users', (req, res) => {
//     res.json(users);
// });

app.post('/register', checkNotAuthenticated, async(req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = {
            "id": Date.now().toString(),
            "name": req.body.name,
            "email": req.body.email,
            "password": hashedPassword
        }
        users.push(user);
        res.redirect('/login');
        // res.status(201).render("login.ejs");
    } catch {
        res.redirect('/register');
        // res.status(500).send();
    }
});

// app.post('/login', async(req, res) => {
//     const user = users.find(user => user.email === req.body.email);
//     if (user === null) {
//         return res.status(400).send('Cannot find user')
//     }
//     try {
//         if (await bcrypt.compare(req.body.password, user.password)) {
//             res.send("Success");
//         } else {
//             res.send("Not Allowed");
//         }
//     } catch {
//         res.status(500).send();
//     }
// });
app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/login');
    }
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    } else {
        return next();
    }
}

app.listen(3000);