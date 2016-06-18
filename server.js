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
// IMPORTANT: I am using zsh shell, environment variables are
// set in .zshrc under root. For bash shell, environment
// variables are stored in .bash_profile under root
app.use(session({ secret: process.env.SESSION_SECRET }));

// Configure and Initialize Passport and Passport Session Support
app.use(passport.initialize());

// has to be after the session in line 16
app.use(passport.session());


// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

// require ("./test/app.js")(app);

var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

var mongoose = require('mongoose');
var connectionString = 'mongodb://127.0.0.1:27017/cs5610summer1';

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}

mongoose.connect(connectionString);

var assignment = require("./assignment/app.js")(app);
// var assignment = require("./project/app.js")(app);

// equivalent to
// var assignment = require("./assignment/app.js");
// assignment(app);

app.listen(port, ipaddress);
