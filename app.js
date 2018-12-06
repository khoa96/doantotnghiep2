var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var session = require('express-session');
var logger = require('morgan');
var multer  = require('multer');
const passport = require('passport');
const flash = require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const mongoose = require('mongoose');
const db = "mongodb://abc:khoanguyen96@ds143532.mlab.com:43532/node_mongoose";
mongoose.Promise = require('bluebird');

/*CONNECT  to monngoose  */
mongoose.connect(db, {useNewUrlParser: true}, err => {
  if(err) {
    console.log(err);
  }else {
    console.log('connnected');
  }
});
// cau hinh session: 

app.use(session({
  secret: 'this-is-a-secret-token', 
  cookie: { maxAge: 1*30*24*60*60*1000 },
  saveUninitialized: true,
  resave: true
}))

app.use(passport.initialize());
app.use(passport.session());

// passport
require('./passport/passport')(passport);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use('/', indexRouter);
app.use('/auth', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
app.use(function (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
})

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
