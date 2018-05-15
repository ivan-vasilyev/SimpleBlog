const Post = require('../models/posts');
const Comment = require('../models/comments');
const path = require('path');
const fs = require('fs');

// Функция загурзки файла на сервер
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

// Отображение всех постов для главной страницы
const listAll = async (req, res, next) => {
  try {
    res.locals.posts = await Post.find({}).populate().exec();
    res.render('index');
  } catch (error) {
    res.render('error');
  }
}

// Вывод формы добавления нового поста
const formNewPost = (req, res, next) => {
  res.render('addpost');
}

// Вывод страницы с полным текстом поста
const viewPost = async (req, res, next) => {
  if (req.params.id) {
    try {
      if (req.user) {
        res.locals.user = req.user;
      }
      res.locals.post = await Post.findById(req.params.id).populate().exec();
      res.render('post');
    } catch (error) {
      res.render('error');
    }
  }
}

// Добавление нового поста
const addNewComment = async (req, res, next) => {
  if (req.body.postId && req.body.name && req.body.email && req.body.comment) {
    const newComment = new Comment({
      name: req.body.name,
      email: req.body.email,
      text: req.body.comment
    });
    
    // Перед добавлением комментария находим текущий пост
    let currentPost = '';
    try {
      currentPost = await Post.findById(req.body.postId).exec();
    } catch (error) {
      return res.render('error'); 
    }

    // Сохраняем комментарий, добавляем к посту и сохраняем пост.
    try {
      const savedComment = await newComment.save();
      currentPost.comments.push(savedComment);
      res.locals.post = await currentPost.save();
      res.locals.flashMessage = 'Комментарий успешно добавлен.';
    } catch (error) {
      res.locals.flashMessage = 'Произошла ошибка сохранения комментария.';
      res.locals.post = currentPost;
    }
    res.render('post');
  }
}

// Вывод формы для редактирования поста
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

// Функция изменения поста
const changePost = async (req, res, next) => {
  if (req.body.id && req.body.header && req.body.text) {
    // Находим текущий пост
    let newPost = '';
    try {
      newPost = await Post.findById(req.body.id).exec();
    } catch (error) {
      return res.render('error');
    }
    
    // обновляем данные
    newPost.header = req.body.header;
    newPost.text = req.body.text;

    // Если пришла новая картинка
    if (req.files) {
      const filePath = path.join('public', 'images', req.files.file.name);
      
      // Определяем абсолютный путь до старой картинки
      let removeFilePath = path.join(__dirname, '../',
        'public', 'images', newPost.image.substr(8));

      // Загружаем новую картинку
      try {
        await uploadNewFile(req, filePath);
        newPost.image = '/images/' + req.files.file.name;
      } catch (error) {
        res.locals.flashMessage = 'Не удалось загрузить файл, попробуйте снова.';
        return res.render('addpost');
      }
      
      // Удаление старой картинки
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

    // Сохраняем пост со всеми изменениями
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

// Удаление поста
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

    // Если пришла картинка, загружаем ее
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

    // Сохранем новый пост
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
  addNewComment,
  addNewPost,
  formChangePost,
  changePost,
  deletePost
};
