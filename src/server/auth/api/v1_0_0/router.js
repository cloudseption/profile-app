const express = require('express');
const router = express.Router();
const token = require('./token');
const permission = require('./permission');
const storeCookie = require('./storeCookie');

router.get('/token', token);
router.get('/permission/:appId', permission.get);
router.post('/permission/:appId', permission.post);
router.post('/storeCookie', storeCookie);

module.exports = router;