const Post = require('../models/posts');

module.exports = {
  listAll(req, res, next) {
    res.render('index');
  }
};
