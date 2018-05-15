const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/ctrlUsers');

/* GET users listing. */
router.get('/', ctrlUsers.addFormOrLK);
router.post('/', ctrlUsers.addUser);

module.exports = router;
