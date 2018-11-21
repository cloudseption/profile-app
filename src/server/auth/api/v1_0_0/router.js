const express = require('express');
const router = express.Router();
const token = require('./token');
const permission = require('./permission');

router.get('/token', token);
router.get('/permission/:appId', permission.get);
router.post('/permission/:appId', permission.post);

module.exports = router;