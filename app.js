const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('cookie-session');
const fileUpload = require('express-fileupload');

const index = require('./app_server/routes/index');
const users = require('./app_server/routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'twig');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('secret'));
app.use(session({
	keys: ['secret'], 
	maxAge: 24 * 60 * 60 * 1000
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

const User = require('./app_server/models/users');

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
	function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

const auth = passport.authenticate(
  'local', {
		successRedirect: '/', 
		failureRedirect: '/login'
	}
);

const mustBeAuthenticated = function (req, res, next) {
	req.isAuthenticated() ? next() : res.redirect('/login');
};

const isAdmin = function (req, res, next) {
	req.isAuthenticated() && req.user.isAdmin ? next() : res.redirect('/login');
};

app.get('/login', function(req, res) {
	res.render('login');
});

app.post('/login', auth);

app.all('/users', mustBeAuthenticated);
app.all('/users/*', mustBeAuthenticated);

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
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
