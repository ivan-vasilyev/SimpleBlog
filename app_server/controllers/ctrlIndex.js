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

// Функия удаления файла с сервера
const deleteFile = (removeFilePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(removeFilePath, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

// Отображение всех постов для главной страницы, с пагинацией
const listAll = async (req, res, next) => {
  try {
    const skip = ((req.query.page - 1) * 3) || 0;
    const allCount = await Post.count({}).exec();
    if (skip > allCount) {
      return res.render('error');
    }
    res.locals.posts = await Post.find({}).skip(skip).limit(3).populate().exec();
    res.locals.allCount = Math.ceil(allCount / 3);
    res.locals.currentPage = req.query.page || 1;
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
  if (!req.params.id) {
    return res.render('error');
  }

  try {
    if (req.user) {
      res.locals.user = req.user;
    }
    res.locals.post = await Post.findById(req.params.id).populate('comments').exec();
    res.render('post');
  } catch (error) {
    res.render('error');
  }
}

// Добавление нового комментария
const addNewComment = async (req, res, next) => {
  if (!req.body.postId && !req.body.name && !req.body.email && !req.body.comment) {
    return res.render('error');
  }

  const newComment = new Comment({
    name: req.body.name,
    email: req.body.email,
    text: req.body.comment
  });
  
  // Перед добавлением комментария находим текущий пост
  let currentPost = '';
  try {
    currentPost = await Post.findById(req.body.postId).populate('comments').exec();
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

// Вывод формы для редактирования поста
const formChangePost = async (req, res, next) => {
  if (!req.params.id) {
    return res.render('error');
  }

  try {
    res.locals.post = await Post.findById(req.params.id).exec();
    res.render('addpost');
  } catch (error) {
    res.render('error');
  }
}

// Функция изменения поста
const changePost = async (req, res, next) => {
  if (!req.body.id && !req.body.header && !req.body.text) {
    return res.render('error');
  }

  // Находим текущий пост
  let newPost = '';
  try {
    newPost = await Post.findById(req.body.id).exec();
  } catch (error) {
    return res.render('error');
  }

  // Определяем абсолютный путь до старой картинки, если она есть
  let removeFilePath = '';
  if (newPost.image) {
    removeFilePath = path.join(__dirname, '../../', 'public', 'images', newPost.image.substr(8));
  }
  
  // обновляем данные
  newPost.header = req.body.header;
  newPost.text = req.body.text;

  // Если пришла новая картинка
  if (req.files.file) {
    const filePath = path.join('public', 'images', req.files.file.name);

    // Загружаем новую картинку
    try {
      await uploadNewFile(req, filePath);
      newPost.image = '/images/' + req.files.file.name;
    } catch (error) {
      res.locals.flashMessage = 'Не удалось загрузить файл, попробуйте снова.';
      return res.render('addpost');
    }
   
    // Удаление старой картинки, если она была
    if (removeFilePath) {
      try {
        await deleteFile(removeFilePath);
      } catch (error) {
        res.locals.flashMessage += 'Старый файл не удалось удалить';
      }
    }
  }

  // Сохраняем пост со всеми изменениями
  try {
    await newPost.save();
    res.locals.flashMessage = 'Запись успешно изменена';
  } catch (error) {
    res.locals.flashMessage = 'Произошла ошибка. Попробуйте снова.';
  }
  res.render('addpost');
}

// Удаление поста
const deletePost = async (req, res, next) => {
  if (!req.params.id) {
    return res.render('error');
  }

  try {
    await Post.findByIdAndRemove(req.params.id).exec();
  } catch (error) {
    res.render('error');
  }
  res.redirect('/');
}

// Добавление нового поста
const addNewPost = async (req, res, next) => {
  if (!req.body.header && !req.body.text) {
    return res.render('error');
  }

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
  try {
    await newPost.save();
    res.locals.flashMessage = 'Запись успешно создана';
  } catch (error) {
    res.locals.flashMessage = 'Произошла ошибка. Попробуйте снова.';
  }
  res.render('addpost');
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
