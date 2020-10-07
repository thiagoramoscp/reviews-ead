if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const { urlencoded } = require('express');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const initializePassport = require("./passport-config");
initializePassport(passport, email => {
    return users.find(user => user.email === email)
});

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

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))



const users = [];

// app.get('/users', (req, res) => {
//     res.json(users);
// });

app.post('/register', async(req, res) => {
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
    console.log(users)
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

app.listen(3000);