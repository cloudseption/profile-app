const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const App = require('../models/app');

router.get('/', (req, res, next) => {
    App.find()
    .exec()
    .then(docs => {
        let sanitizedDocs = [];
        docs.forEach(doc => {
            sanitizedDocs.push({
                _id:               doc._id,
                appId:             doc.appId,
                displayName:       doc.displayName,
                url:               doc.url,
                appToken:          doc.appToken,
                requiredResources: doc.requiredResources,
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
            _id:               doc._id,
            appId:             doc.appId,
            displayName:       doc.displayName,
            url:               doc.url,
            appToken:          doc.appToken,
            requiredResources: doc.requiredResources,
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
    let appName  = req.body.name;

    App.find({ name: appName })
    .exec()
    .then(docs => {
        if (docs.length > 0) {
            throw new Error(`Application ID ${appName} already exists.`);
        }
    })
    .then(() => {
        return new App({
            _id: new mongoose.Types.ObjectId(),
            appId:                  req.body.appId,
            displayName:            req.body.displayName,
            url:                    req.body.url,
            appToken:               req.body.appToken,
            clientKey:              null,
            clientSecret:           null,
            requiredResources:      req.body.requiredResources
        });
    })
    .then(newApp => {
        return newApp.save()
        .then(() => {
            res.status(201).json({
                message: "Handling POST requests to /apps",
                createdApp: newApp
            });
        })
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

module.exports = router;