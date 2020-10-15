const express = require('express');
const User = require('../models/users');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');



function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    } else {
        return next();
    }
}

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs', {
        title: "Login"
    });
});

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs', {
        title: "Register"
    });
});

const users = [];

router.post('/register', checkNotAuthenticated, async(req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = {
            "name": req.body.name,
            "email": req.body.email,
            "password": hashedPassword
        };
        new User(user).save().then(() => {
            res.redirect('/auth/login');
        }).catch((err) => {
            console.log("Erro ao registrar novo usuário na BD: " + err);
        });

    } catch (err) {
        console.log("catch!: " + err);
        res.redirect('/auth/register');
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
router.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;