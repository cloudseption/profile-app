const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jose = require('node-jose');

const App = require('../models/app');

router.get('/', (req, res, next) => {
    App.find()
    .exec()
    .then(docs => {
        let sanitizedDocs = [];
        docs.forEach(doc => {
            sanitizedDocs.push({
                appId:               doc.appId,
                displayName:         doc.displayName,
                url:                 doc.url,
                badgeEndpoint:       doc.badgeEndpoint,
                skillSearchEndpoint: doc.skillSearchEndpoint,
                landingEndpoint:     doc.landingEndpoint,
                appToken:            doc.appToken,
                requiredResources:   doc.requiredResources,
            });
        });
        res.status(200).json(sanitizedDocs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err  });
    });
});

router.get('/:appId', (req, res, next) => {
    console.log(req.params.appId);
    App.findOne({ appId: req.params.appId })
    .exec()
    .then(doc => {
        if (!doc) {
            throw new Error(`${req.params.appId} not found`);
        }
        let sanitizedDoc = {
            appId:               doc.appId,
            displayName:         doc.displayName,
            url:                 doc.url,
            badgeEndpoint:       doc.badgeEndpoint,
            skillSearchEndpoint: doc.skillSearchEndpoint,
            landingEndpoint:     doc.landingEndpoint,
            appToken:            doc.appToken,
            requiredResources:   doc.requiredResources,
        }
        res.status(200).json(sanitizedDoc);
    })
    .catch(err => {
        console.log(err);
        if (err.message) {
            err = err.message;
        }
        res.status(500).json({ error: err  });
    });
});

router.post('/', (req, res, next) => {
    let appName  = req.body.appId;

    App.find({ name: appName })
    .exec()
    .then(docs => {
        if (docs.length > 0) {
            throw new Error(`Application ID ${appName} already exists.`);
        }
    })
    .then(generateKeyPair)
    .then(key => {
        console.log(key);
        return new App({
          _id: new mongoose.Types.ObjectId(),
          appId:               req.body.appId,
          displayName:         req.body.displayName,
          url:                 req.body.url,
          badgeEndpoint:       req.body.badgeEndpoint,
          skillSearchEndpoint: req.body.skillSearchEndpoint,
          landingEndpoint:     req.body.landingEndpoint,
          appToken:            req.body.appToken,
          clientKey:           key.kid,
          clientSecret:        key.k,
          requiredResources:   req.body.requiredResources
        });
    })
    .then(newApp => {
        return newApp.save()
        .then(() => {
            res.status(201).json({
                message: `Set up new app ${newApp.appId}. Please keep your `
                + `clientKey, clientSecret, and appToken safe`,
                clientKey: newApp.clientKey,
                clientSecret: newApp.clientSecret,
                appToken: newApp.appToken
            });
        });
    })
    .catch(err => {
        let msg = err;
        if (err.message) {
            msg = err.message;
        }
        console.log(err);
        res.status(500).json({
            error: msg
        });
    });
});

router.post('/:appName/keypair', (req, res, next) => {
    let kid;
    let secret;

    App.findOne({ appId: req.params.appName })
    .exec()
    .then(docs => docs._id )
    .then(id => {
        return generateKeyPair()
        .then(key => {
            kid     = key.kid;
            secret  = key.k;
            return App.update({ _id: id }, {
                $set: {
                    clientKey: key.kid,
                    clientSecret: key.k
                }
            }).exec();
        });
    })
    .then(() => {
        res.json({
            message: `New client key/client secret generated for ${req.params.appName}.`,
            clientKey: kid,
            clientSecret: secret
        });
    })
});

router.patch('/:appName', (req, res, next) => {
    const updateOperations = {};
    for (const ops of req.body) {
        updateOperations[ops.propName] = ops.value;
    }

    App.findOne({ appId: req.params.appName })
    .exec()
    .then(docs => docs._id )
    .then(id => {
        return App.update({ _id: id }, { $set: updateOperations }).exec();
    })
    .then(result => {
        // console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

router.delete("/:appId", (req, res, next) => {
    const id = req.params.appId;
    App.remove({appId: id})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

function generateKeyPair() {
    return jose.JWK.createKey("oct", 256, { alg: 'HS256' })
    .then(key => key.toJSON(true));
}

module.exports = router;