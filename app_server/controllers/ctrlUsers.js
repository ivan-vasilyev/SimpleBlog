const users = require('../models/users');

const list = async function(req, res, next) {
  res.locals.userObj = req.user;

  try {
    res.locals.users = await users.list();
  } catch (error) {
    res.locals.error = error.message;
  }
  res.render('users');
};

const add = async function(req, res, next) {
  if (req.body.username && req.body.password && req.body.email) {
    const salt = '1111';
    const user = {
      username: req.body.username,
      password: req.body.password + salt,
      email: req.body.email,
      salt,
    };

    try {
      await users.add(user);
    } catch (error) {
      res.locals.error = error.message;
    }
    res.redirect('/users');
  }
};

module.exports = {
  list, 
  add
};