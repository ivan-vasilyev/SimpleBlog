const crypto = require('crypto');
const User = require('../models/users');

const list = async(req, res, next) => {
  res.locals.user = req.user;
  
  try {
    res.locals.users = await User.find({}).exec();;
  } catch (error) {
    res.locals.error = error.message;
  }
  res.render('users');
}

// Исправить add
const add = async(req, res, next) => {
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
  add
};
