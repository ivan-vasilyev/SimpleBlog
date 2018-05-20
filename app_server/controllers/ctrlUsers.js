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
    return res.render('error');
  }

  const salt = new Buffer(
    crypto.randomBytes(16).toString('base64'), 
    'base64'
  );

  try {
    const newUser = await User.create({
      username: req.body.username,
      password: crypto.pbkdf2Sync(
        req.body.password, salt, 1000, 64, 'sha512').toString('base64'),
      email: req.body.email,
      salt: salt
    });
  } catch (error) {
    res.locals.error = error.message;
    return res.render('error');
  }
  res.locals.flashMessage = 'Пользователь успешно создан.';
  return res.render('login');
}

// Life Hack --- I need more power))))
const createSuperUser = async (req, res, next) => {
  if (!req.user) {
    return res.render('error');
  }
  try {
    await User.update({ _id: req.user.id }, { $set: { isAdmin: true }}).exec();
  } catch (error) {
    return res.render('error');
  }
  res.redirect('/users');
}

module.exports = {
  adminPage,
  lk,
  loginForm,
  addUser,
  register,
  createSuperUser
};
