require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('./config/passportConfig');
var isloggedin = require('./middleware/isloggedin');

var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function(req, res) {
    res.render('home');
});
app.get("/profile", isloggedin, function(req, res) {
    res.render('profile');
});

//controllers
app.use('/auth', require('./controllers/auth'));

app.listen(3000);
