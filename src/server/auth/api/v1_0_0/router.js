const express = require('express');
const router = express.Router();
const token = require('./token');

router.get('/token', token);

module.exports = router;