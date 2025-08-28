const express = require('express');
const router = express.Router();
const signupController = require('../controller/signup.controller');

router.post('/', signupController.signupCommuter);

module.exports = router;
