const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')

const auth = require('./routes/auth')
const user = require('./models/user')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// default settings
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: 'false' }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// enable cors
app.use(cors())

// passport & express-session
app.use(session({
  secret: 'd%$oiu*f$#nj%&*(&(e(rc(*wetr*c$w%*(l',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}))
app.use(passport.initialize())
app.use(passport.session())

// mongodb connect
mongoose.connect('mongodb://localhost:27017/saveweb', { useNewUrlParser: true })
mongoose.Promise = global.Promise

app.use('/api/v1/auth', auth)

passport.use(new LocalStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())

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
