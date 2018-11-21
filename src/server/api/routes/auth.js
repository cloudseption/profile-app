const express = require('express');
const router = express.Router();
const jose = require('node-jose');

const App = require('../models/app');
const User = require('../models/user');
const PermissionSet = require('../models/permissionSet');

router.get('/token', async function getAccessToken(req, res, next) {
    try {
        let userId      = await req.clientId;
        let user        = await (User.findOne({ userId: userId })).exec();
        let app         = await App.findOne({ clientKey: req.headers.client_key }).exec();
        let appId       = app.appId;
        let permissions = await PermissionSet.findOne({ clientId: appId, resourceId: userId }).exec();
        
        const userClaims = { userId: userId, email: user.email, name: user.name };
        const keyJson    = { kty: "oct", kid: app.clientKey, k:   app.clientSecret };

        if (permissions) {
            jose.JWK.asKey(keyJson)
            .then(key => {
                return jose.JWS.createSign({
                    fields: {
                        alg: 'HS256',
                        typ: 'jwt'
                    },
                    format: 'compact'
                }, { key: key })
                .update(JSON.stringify(userClaims))
                .final();
            })
            .then(jws => {
                res.status(200).json({ accesstoken: jws });
            });
        }
        else {
            console.log(`User ${userId} not enrolled in app ${appId}`);
            res.status(401).json({
                message: 'NEED_PERMISSION',
                userId: userId,
                appId: client.appId
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;