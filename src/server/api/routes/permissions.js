const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const PermissionSet = require('../models/permissionSet');

router.get('/', (req, res, next) => {
    PermissionSet.find()
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err  });
    });
});

router.post('/:clientId/:resourceId', (req, res, next) => {
    let clientId    = req.params.clientId;
    let resourceId  = req.params.resourceId;
    let permissions = req.body.permissions;

    if (!Array.isArray(permissions)) {
        permissions = [ permissions ];
    }

    PermissionSet.find({clientId: clientId, resourceId: resourceId })
    .then(docs => {
        if (docs.length === 0) {
            return saveNewPermissionSet(clientId, resourceId, permissions);
        } else {
            return updatePermissionSet(docs[0], permissions);
        }
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Handling POST requests to /permissionSets",
            createdPermissionSet: result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:clientId/:resourceId', (req, res, next) => {
    const clientId      = req.params.clientId;
    const resourceId    = req.params.resourceId;

    PermissionSet.find({
        clientId: clientId,
        resourceId: resourceId
    })
    .exec()
    .then(doc => {
        console.log(doc);
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({ message: 'No valid entry found for that client/resource pair' });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

router.delete("/:clientId/:resourceId", (req, res, next) => {
    const clientId      = req.params.clientId;
    const resourceId    = req.params.resourceId;

    PermissionSet.remove({
        clientId: clientId,
        resourceId: resourceId
    })
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

function saveNewPermissionSet(clientId, resourceId, permissions) {
    const permissionSet = new PermissionSet({
        _id: new mongoose.Types.ObjectId(),
        clientId:    clientId, 
        resourceId:  resourceId,
        permissions: permissions
    });

    return permissionSet.save();
}

function updatePermissionSet(permissionSet, permissions) {
    console.log(permissions);
    permissions.forEach(permission => {
        permissionSet.permissions.addToSet( permission );
    })

    return permissionSet.save();
}

module.exports = router;