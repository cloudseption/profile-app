const express = require('express');
const path = require('path');
const router = express.Router();
const api_1_0_0 = require('./api/v1_0_0/router');

router.use(express.static(path.join(__dirname, 'static')));
router.use('/api/1.0.0', api_1_0_0);

module.exports = router;