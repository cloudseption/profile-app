const express = require('express');
const router = express.Router();

const App = require('../models/app');
const PermissionSet = require('../models/permissionSet');

router.get('/token', async function handleRequest(req, res, next) {
    try {
        let userId      = await req.clientId;
        let app         = await App.findOne({ clientKey: req.headers.client_key }).exec();
        let didEnroll   = await PermissionSet.find({})
        
        if (!userHasEnrolled) {
            console.log(`User ${user && user.uuid ? user.uuid : user} not enrolled in app ${client.appId}`);
            res.send({
                notice: 'NEED_PERMISSION',
                appId: client.appId
            });
        }
        else {
            let token = await authProvider.getAccessToken(user, client);
            res.send({ accesstoken: token });
        }

    } catch (err) {
        console.log(err);
        res.status(401).send({ error: err.message });
    }
});

module.exports = router;