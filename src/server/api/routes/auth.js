const express = require('express');
const router = express.Router();
const jose = require('node-jose');

const App = require('../models/app');
const User = require('../models/user');
const PermissionSet = require('../models/permissionSet');

router.get('/token', async function getAccessToken(req, res, next) {
    try {
        let app         = await App.findOne({ clientKey: req.headers.client_key }).exec();
        let appId       = app.appId;
        let userId      = await req.clientId;

        console.log(`getAccessToken: user ${userId}, app ${appId}`);

        let user        = await User.findOne({ userId: userId }).exec();
        let permissions = await PermissionSet.findOne({ clientId: appId, resourceId: userId }).exec();
        
        const userClaims = {
            userId: userId,
            email: user.email,
            name: user.name,
            exp: Date.now() + (60 * 60 * 1000)
        };
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
                console.log(`Access token generated for app ${appId} and user ${userId}`);
                res.status(200).json({
                    accesstoken: jws,
                    permission: 'GRANTED'
                });
            });
        }
        else {
            console.log(`User ${userId} not enrolled in app ${appId}`);
            res.status(401).json({
                notice: 'NEED_PERMISSION',
                userId: userId,
                appId: appId
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;