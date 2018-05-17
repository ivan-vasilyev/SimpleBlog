const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/ctrlUsers');
const auth = require('./auth');

/* GET users listing. */
router.get('/', auth.mustBeAuthenticated, ctrlUsers.lk);
router.post('/', ctrlUsers.addUser);
router.get('/login', ctrlUsers.loginForm);
router.get('/register', ctrlUsers.register);
router.get('/admin', auth.isAdmin, ctrlUsers.adminPage);

module.exports = router;
