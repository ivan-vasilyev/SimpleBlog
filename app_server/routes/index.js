const express = require('express');
const router = express.Router();
const ctrlIndex = require('../controllers/ctrlIndex');

/* GET home page. */
router.get('/', ctrlIndex.listAll);

module.exports = router;
