const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/ctrlUsers');
const auth = require('./auth');

/* GET users listing. */
router.get('/', auth.mustBeAuthenticated, ctrlUsers.lk);
router.post('/', auth.mustBeAuthenticated, ctrlUsers.addUser);
router.get('/login', ctrlUsers.loginForm);
router.get('/admin', auth.isAdmin, ctrlUsers.adminPage);

module.exports = router;
