var express = require('express');
// Configure Express Session Support
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var passport = require('passport');

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

// session has to be created after cookie
// console.log(process.env.SESSION_SECRET);
// app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(session({ secret: "secret" }));

// Configure and Initialize Passport and Passport Session Support
app.use(passport.initialize());

// has to be after the session in line 16
app.use(passport.session());


// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

// require ("./test/app.js")(app);

var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

var assignment = require("./assignment/app.js")(app);

// equivalent to
// var assignment = require("./assignment/app.js");
// assignment(app);

app.listen(port, ipaddress);
