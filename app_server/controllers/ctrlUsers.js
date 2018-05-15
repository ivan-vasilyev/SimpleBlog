const crypto = require('crypto');
const User = require('../models/users');

// Функция и шаблон для админа
const list = async(req, res, next) => {
  res.locals.user = req.user;
  
  try {
    res.locals.users = await User.find({}).exec();;
  } catch (error) {
    res.locals.error = error.message;
  }
  res.render('users');
}

// Функция по запросу выдает либо форму для регистрации, 
// либо открывает личный кабинет.
const addFormOrLK = async (req, res, next) => {
  if (req.user) {
    res.locals.user = req.user;
    return res.render('lk');
  }

  res.render('login');
}

// TODO
// Функция добавления нового юзера
const addUser = async(req, res, next) => {
  if (req.body.username && req.body.password && req.body.email) {
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
      await newUser.save();
    } catch (error) {
      res.locals.error = error.message;
    }
    res.redirect('/users');
  }
}

module.exports = {
  list,
  addFormOrLK,
  addUser
};
