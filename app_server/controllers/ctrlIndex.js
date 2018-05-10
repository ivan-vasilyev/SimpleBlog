const Task = require('../models/task');

module.exports = {
  async list(req, res, next) {
    res.locals.userObj = req.user;
    try {
      res.locals.tasks = await Task.find({}).exec();
    } catch (error) {
      res.locals.error = error.message;
    }
    res.render('index');
  },

  async add(req, res, next) {
    if (req.body.task) {
      const newTask = new Task({
        text: req.body.task,
        complete: false
      });
      try {
        const changed = await newTask.save();
        res.redirect('/');
      } catch (error) {
        res.locals.error = error.message;
        res.render('index');
      }
    } 
  },

  async change(req, res, next) {
    if (req.body.num && req.body.task) {
      Task
        .update({_id: req.body.num}, { $set: { text: req.body.task }})
        .then(() => {
          res.redirect('/');
        })
        .catch(err => {
          res.locals.error = err;
          res.render('error');
        });
    }
  },

  async complete(req, res, next) {
    if (req.params.id) {
      Task
        .update({_id: req.params.id}, { $set: { complete: true }})
        .then(() => {
          res.redirect('/');
        })
        .catch(err => {
          res.locals.error = err;
          res.render('error');
        });
    }
  },

  async deleteTask(req, res, next) {
    if (req.params.id) {
      Task
        .remove({_id: req.params.id})
        .then(() => {
          res.redirect('/');
        })
        .catch(err => {
          res.locals.error = err;
          res.render('error');
        });
    }
  }
};
