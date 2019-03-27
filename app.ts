import createError from 'http-errors'
import express from 'express'
import path from 'path'
import logger from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import session from 'express-session'
import dotenv from "dotenv"

import auth from './routes/auth'
import user from './models/user'

const port = process.env.PORT || 3000;

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// default settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// enable cors
app.use(cors());

// passport & express-session
app.use(session({
  secret: 'd%$oiu*f$#nj%&*(&(e(rc(*wetr*c$w%*(l',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));
app.use(passport.initialize());
app.use(passport.session());

// mongodb connect
// mongoose.connect('mongodb://localhost:27017/saveweb', { useNewUrlParser: true })
// mongoose.Promise = global.Promise

app.use('/api/v1/auth', auth);

passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// main
app.get('/', (req: express.Request, res: express.Response) => {
  res.send( "Hello world!" )
});

// catch 404 and forward to error handler
app.use(function(req: express.Request, res: express.Response, next: express.NextFunction) {
  next(createError(404))
});

// error handler
app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error')
});

// start server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log( `server started at http://localhost:${ port }` )
});

module.exports = app;
