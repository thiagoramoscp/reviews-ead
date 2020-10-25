const express = require('express');
const { User, userSchema } = require('../models/users');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');


function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    } else {
        return next();
    }
}

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs', {
        title: "Login",
        message: req.flash('userRegistered')
    });
});

router.post('/login', checkNotAuthenticated, passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}))

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs', {
        title: "Register",
        message: req.flash('emailTaken')
    });
});

router.post('/register', checkNotAuthenticated, async(req, res) => {

    const registeredUser = await User.findOne({ email: req.body.email }).exec();

    if (registeredUser) {
        req.flash('emailTaken', 'E-mail já registrado.');
        res.redirect('/auth/register');
    } else {
        try {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const user = {
                "name": req.body.name,
                "email": req.body.email,
                "password": hashedPassword
            };
            new User(user).save().then(() => {
                req.flash('userRegistered', 'Usuário cadastrado com sucesso!')
                res.redirect('/auth/login');
            }).catch((err) => {
                console.log("Erro ao registrar novo usuário na BD: " + err);
            });

        } catch (err) {
            console.log("catch!: " + err);
            res.redirect('/auth/register');
        }
    }


});

router.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;