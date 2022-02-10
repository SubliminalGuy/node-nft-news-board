var createError = require('http-errors');
var express = require('express');
var path = require('path');
const session = require("express-session");
const passport = require("passport");
//const LocalStrategy = require("passport-local").Strategy;
var compression = require('compression');
var helmet = require('helmet');

var cookieParser = require('cookie-parser');
var logger = require('morgan');

var handlebars = require('hbs')

// Import the Database Object
const db = require('./database/connection')

// Bind connection to error event (to get notifictaion of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error'));

var app = express();
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(compression()); //Compress all routes


var indexRouter = require('./routes/index');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

handlebars.registerHelper('loud', (name) => {
  return name.toUpperCase()
})

handlebars.registerHelper('publishedDate', (timestamp) => {
  var publish_String = ""
  publish_String = timestamp.getDate().toString();
  publish_String += "."
  publish_String += (timestamp.getMonth() + 1).toString();
  publish_String += "."
  publish_String += timestamp.getFullYear().toString();
  return publish_String
})




app.use(function(req, res, next) {

  if (!req.user || req.user.memberstatus === "Member" || req.user.memberstatus === "Admin" ) {
    res.locals.showMemberLog = false;
  }
  else {
    res.locals.showMemberLog = true;
  }
  
  next();
});

app.use(function(req, res, next) {

  if (req.user && req.user.memberstatus === "Member" || req.user && req.user.memberstatus === "Admin" ) {
    res.locals.isMember = true;
  }
  else {
    res.locals.isMember = false;
  }
  next();
});

app.use(function(req, res, next) {

  if (!req.user || req.user.memberstatus === "Admin") {
    res.locals.showAdminLog = false;
  }
  else {
    res.locals.showAdminLog = true;
  }
  next();
});

app.use(function(req, res, next) {

  if (req.user && req.user.memberstatus === "Admin") {
    res.locals.isAdmin = true;
  }
  else {
    res.locals.isAdmin = false;
  }
  next();
});


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
