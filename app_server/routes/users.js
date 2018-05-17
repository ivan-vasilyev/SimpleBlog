const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/ctrlUsers');

const mustBeAuthenticated = function (req, res, next) {
	req.isAuthenticated() ? next() : res.redirect('/users/login');
};

const isAdmin = function (req, res, next) {
	req.isAuthenticated() && req.user.isAdmin ? next() : res.redirect('/users');
};


/* GET users listing. */
router.get('/', mustBeAuthenticated, ctrlUsers.lk);
router.post('/', mustBeAuthenticated, ctrlUsers.addUser);
router.get('/login', ctrlUsers.loginForm);
router.get('/admin', isAdmin, ctrlUsers.adminPage);

module.exports = router;
