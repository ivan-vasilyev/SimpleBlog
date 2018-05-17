const express = require('express');
const router = express.Router();
const ctrlIndex = require('../controllers/ctrlIndex');
const auth = require('./auth');

/* GET home page. */
router.get('/', ctrlIndex.listAll);
router.get('/posts', auth.isAdmin, ctrlIndex.formNewPost);
router.post('/posts', auth.isAdmin, ctrlIndex.addNewPost);
router.get('/posts/:id', ctrlIndex.viewPost);
router.post('/posts/:id', ctrlIndex.addNewComment);
router.get('/posts/:id/change', auth.isAdmin, ctrlIndex.formChangePost);
router.post('/posts/:id/change', auth.isAdmin, ctrlIndex.changePost);
router.get('/posts/:id/delete', auth.isAdmin, ctrlIndex.deletePost);

module.exports = router;
