const express = require('express');
const router = express.Router();
const permissions = require('./routes/permissions');
const users = require('./routes/users');

router.use('/permissions', permissions);
router.use('/users', users);

module.exports = router;