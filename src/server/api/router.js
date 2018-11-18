const express = require('express');
const router = express.Router();
const permissions = require('./routes/permissions');
const resources = require('./routes/resources');
const users = require('./routes/users');

router.use('/permissions', permissions);
router.use('/resources', resources);
router.use('/users', users);

module.exports = router;