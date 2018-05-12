const Post = require('../models/posts');
const path = require('path');

function uploadNewFile(req, FilePathOnServer){
  return new Promise((resolve, reject) => {
    req.files.file.mv(FilePathOnServer, function(err) {
      if (err) {
        return reject();
      }
      
      resolve();
    });
  });
}

module.exports = {
  listAll(req, res, next) {
    res.render('index');
  },

  formNewPost(req, res, next) {
    res.render('addpost');
  },

  async addNewPost(req, res, next) {
    if (req.body.header && req.body.text) {
      const newPost = new Post({
        header: req.body.header,
        text: req.body.text
      });

      if (req.files) {
        const filePath = path.join('public', 'download', req.files.file.name);
        try {
          await uploadNewFile(req, filePath);
          newPost.image = '/download/' + req.files.file.name;
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
};
