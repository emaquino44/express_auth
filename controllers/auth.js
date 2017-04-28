var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models');
var router = express.Router();

//Routes
router.get('/login', function(req, res) {
    res.render('loginform');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    successFlash: 'Good Job, you logged in',
    failureRedirect: '/auth/login',
    failureFlash: 'Try again, loser'
}));

router.get('/signup', function(req, res) {
    res.render('signform');
});

router.post('/signup', function(req, res, next) {
    db.user.findOrCreate({
        where: { email: req.body.email },
        defaults: {
            'firstName': req.body.firstName,
            'lastName': req.body.lastName,
            'password': req.body.password
        }
    }).spread(function(user, wasCreated) {
        if (wasCreated) {
            //GOOD! log them in
            passport.authenticate('local', {
                successRedirect: '/profile',
                successFlash: 'Account created and logged in!',
                failureRedirect: '/login',
                failureFlash: 'Unknown error occured, please re-login. :('
            })(req, res, next);
        } else {
            //BAD!
            req.flash('error', 'Email already exists! Please Login.');
            res.redirect('/auth/login');
        }
    }).catch(function(error) {
        req.flash('error', error.message);
        res.redirect('/auth/signup');
    });
});

router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'You logged out, see ya next time');
    res.redirect('/');

});


//Export
module.exports = router;
