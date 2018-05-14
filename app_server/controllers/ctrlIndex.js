const Post = require('../models/posts');
const Comment = require('../models/comments');
const path = require('path');

const uploadNewFile = (req, FilePathOnServer) => {
  return new Promise((resolve, reject) => {
    req.files.file.mv(FilePathOnServer, function(err) {
      if (err) {
        return reject();
      }
      
      resolve();
    });
  });
}

const listAll = (req, res, next) => {
  res.locals.posts = Post.find({}).populate().exec();
  res.render('index');
}

const formNewPost = (req, res, next) => {
  res.render('addpost');
}

const addNewPost = async(req, res, next) => {
  if (req.body.header && req.body.text) {
    const newPost = new Post({
      header: req.body.header,
      text: req.body.text
    });

    if (req.files) {
      const filePath = path.join('public', 'images', req.files.file.name);
      try {
        await uploadNewFile(req, filePath);
        newPost.image = '/images/' + req.files.file.name;
      } catch (error) {
        res.locals.flashMessage = 'Не удалось загрузить файл, попробуйте снова.';
        return res.render('addpost');
      }
    }

    newPost.save(err => {
      if (err) {
        res.locals.flashMessage = 'Произошла ошибка. Попробуйте снова.';
        return res.render('addpost');
      }

      res.locals.flashMessage = 'Запись успешно создана';
      res.render('addpost');
    });
  }
}

module.exports = {
  listAll,
  formNewPost,
  addNewPost
};
