const express = require('express');
const router = express.Router();
const ctrlIndex = require('../controllers/ctrlIndex');

/* GET home page. */
router.get('/', ctrlIndex.listAll);
router.get('/posts', ctrlIndex.formNewPost);
router.post('/posts', ctrlIndex.addNewPost);

module.exports = router;
