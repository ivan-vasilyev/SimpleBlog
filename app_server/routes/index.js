const express = require('express');
const router = express.Router();
const ctrlIndex = require('../controllers/ctrlIndex');

/* GET home page. */
router.get('/', ctrlIndex.listAll);
router.get('/posts', ctrlIndex.formNewPost);
router.post('/posts', ctrlIndex.addNewPost);
router.get('/posts/:id', ctrlIndex.viewPost);
router.get('/posts/:id/change', ctrlIndex.formChangePost);
router.post('/posts/:id/change', ctrlIndex.changePost);
router.get('/posts/:id/delete', ctrlIndex.deletePost);

module.exports = router;
