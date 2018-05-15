const Post = require('../models/posts');
const Comment = require('../models/comments');
const path = require('path');
const fs = require('fs');

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

const listAll = async (req, res, next) => {
  try {
    res.locals.posts = await Post.find({}).populate().exec();
    res.render('index');
  } catch (error) {
    res.render('error');
  }
}

const formNewPost = (req, res, next) => {
  res.render('addpost');
}

const viewPost = async (req, res, next) => {
  if (req.params.id) {
    try {
      res.locals.post = await Post.findById(req.params.id).populate().exec();
      res.render('post');
    } catch (error) {
      res.render('error');
    }
  }
}

const formChangePost = async (req, res, next) => {
  if (req.params.id) {
    try {
      res.locals.post = await Post.findById(req.params.id).exec();
      res.render('addpost');
    } catch (error) {
      res.render('error');
    }
  }
}

const changePost = async (req, res, next) => {
  if (req.body.id && req.body.header && req.body.text) {
    const newPost = await Post.findById(req.body.id).exec();

    newPost.header = req.body.header;
    newPost.text = req.body.text;

    if (req.files) {
      const filePath = path.join('public', 'images', req.files.file.name);
      let removeFilePath = path.join(__dirname, '../',
        'public', 'images', newPost.image.substr(8));
      try {
        await uploadNewFile(req, filePath);
        newPost.image = '/images/' + req.files.file.name;
      } catch (error) {
        res.locals.flashMessage = 'Не удалось загрузить файл, попробуйте снова.';
        return res.render('addpost');
      }
      
      try {
        await new Promise((resolve, reject) => {
          fs.unlink(removeFilePath, err => {
            if (err) {
              reject(err);
            }
            resolve();
          });
        });
      } catch (error) {
        res.locals.flashMessage += 'Старый файл не удалось удалить';
      }
    }

    newPost.save(err => {
      if (err) {
        res.locals.flashMessage = 'Произошла ошибка. Попробуйте снова.';
        return res.render('addpost');
      }

      res.locals.flashMessage = 'Запись успешно изменена';
      res.render('addpost');
    });
  }
}

const deletePost = async (req, res, next) => {
  if (req.params.id) {
    try {
      await Post.findByIdAndRemove(req.params.id).exec();
      res.render('index');
    } catch (error) {
      res.render('error');
    }
  }
}

const addNewPost = async (req, res, next) => {
  if (req.body.header && req.body.text) {
    const newPost = new Post({
      header: req.body.header,
      text: req.body.text
    });

    if (req.files.file) {
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
  viewPost,
  addNewPost,
  formChangePost,
  changePost,
  deletePost
};
