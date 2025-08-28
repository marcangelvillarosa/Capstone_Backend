// routes/driverinfo.router.js
const express = require('express');
const router = express.Router();
const driverinfoController = require('../controller/driverinfo.controller');

// GET /api/v1/driverinfo/:email
router.get('/:email', driverinfoController.getDriverByEmail);

module.exports = router;
