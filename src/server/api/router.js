const express = require('express');
const router = express.Router();
const permissions = require('./routes/permissions');
const resources = require('./routes/resources');
const apps = require('./routes/apps');
const users = require('./routes/users');
const auth = require('./routes/auth');

router.use('/permissions', permissions);
router.use('/resources', resources);
router.use('/apps', apps);
router.use('/users', users);
router.use('/auth', auth);

module.exports = router;