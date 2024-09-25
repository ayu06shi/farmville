const express = require('express');
const router = express.Router();

// importing controllers
const { 
    signupController,
    loginController,
    logoutController,
} = require('../controllers/AuthController');

// signup
router.post('/signup', signupController);

// login
router.post('/login', loginController);

// logout
router.post('/logout', logoutController);

module.exports = router;
