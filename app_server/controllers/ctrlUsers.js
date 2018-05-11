const User = require('../models/users');

module.exports = {
  async list(req, res, next) {
    res.locals.user = req.user;
    
    try {
      res.locals.users = await User.find({}).exec();;
    } catch (error) {
      res.locals.error = error.message;
    }
    res.render('users');
  },
  // Исправить add
  async add(req, res, next) {
    if (req.body.username && req.body.password && req.body.email) {
      const salt = '1111';
      const newUser = new User({
        username: req.body.username,
        password: req.body.password + salt,
        email: req.body.email,
        salt: user.salt
      });
  
      try {
        await newUser.save();
      } catch (error) {
        res.locals.error = error.message;
      }
      res.redirect('/users');
    }
  }
};
