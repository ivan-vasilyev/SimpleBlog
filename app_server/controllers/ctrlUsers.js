const crypto = require('crypto');
const User = require('../models/users');

// Функция и шаблон для админа
const adminPage = async (req, res, next) => {
  res.locals.admin = req.user;
  
  try {
    res.locals.users = await User.find({}).exec();
  } catch (error) {
    res.locals.error = error.message;
  }
  res.render('admin');
}
 
// Личный кабинет.
const lk = async (req, res, next) => {
  if (!req.user) {
    res.render('error');
  }

  res.locals.user = req.user;
  return res.render('lk');
}

// Форма авторизации
const loginForm = (req, res, next) => {
  res.render('login');
}

// Форма регистрации
const register = (req, res, next) => {
  res.render('register');
}

// Функция добавления нового юзера
const addUser = async (req, res, next) => {
  if (!req.body.username && !req.body.password && !req.body.email) {
    res.render('error');
  }

  const salt = new Buffer(
    crypto.randomBytes(16).toString('base64'), 
    'base64'
  );

  const newUser = new User({
    username: req.body.username,
    password: crypto.pbkdf2Sync(
      req.body.password, salt, 1000, 64).toString('base64'),
    email: req.body.email,
    salt: salt
  });

  try {
    await newUser.save().exec();
  } catch (error) {
    res.locals.error = error.message;
    res.render('error');
  }
  res.redirect('/users');
}

module.exports = {
  adminPage,
  lk,
  loginForm,
  addUser,
  register
};
