const express = require('express');
const router = express.Router();
const driversignup = require('../controller/driversignup.controller');
const upload = require('../middleware/multer'); // ✅ import multer middleware

router.post('/', upload.single('DriverImage'), driversignup.signupDriver);

module.exports = router;
