const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ExtApp = require('../models/extApp');

router.get('/', (req, res, next) => {
    ExtApp.find()
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

router.get('/:extAppId', (req, res, next) => {
    console.log(req.params.extAppId);
    ExtApp.findOne({ appId: req.params.extAppId })
    .exec()
    .then(doc => {
        if (!doc) {
            throw new Error(`${req.params.extAppId} not found`);
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
    let extAppName  = req.body.name;

    ExtApp.find({ name: extAppName })
    .exec()
    .then(docs => {
        if (docs.length > 0) {
            throw new Error(`Application ID ${extAppName} already exists.`);
        }
    })
    .then(() => {
        return new ExtApp({
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
    .then(newExtApp => {
        return newExtApp.save()
        .then(() => {
            res.status(201).json({
                message: "Handling POST requests to /extApps",
                createdExtApp: newExtApp
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

router.patch('/:extAppName', (req, res, next) => {
    const updateOperations = {};
    for (const ops of req.body) {
        updateOperations[ops.propName] = ops.value;
    }

    ExtApp.findOne({ appId: req.params.extAppName })
    .exec()
    .then(docs => docs._id )
    .then(id => {
        return ExtApp.update({ _id: id }, { $set: updateOperations }).exec();
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

router.delete("/:extAppId", (req, res, next) => {
    const id = req.params.extAppId;
    ExtApp.remove({appId: id})
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