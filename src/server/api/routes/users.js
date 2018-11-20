const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Axios = require('axios');

const User = require('../models/user');
const App = require('../models/app');
const PermissionSet = require('../models/permissionSet');

router.get('/', (req, res, next) => {
    User.find()
    .exec()
    .then(docs => {
        // console.log(docs);
        res.status(200).json(docs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err  });
    });
});

router.post('/', (req, res, next) => {
    if (!req.body.userId) {
        throw new Error(`Must supply user ID to create new user`);
    }

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        userId: req.body.userId || '',
        email: req.body.email || '',
        name: req.body.name,
        description: req.body.description,
        picture: req.body.picture
    });

    User.find({ userId: req.body.userId })
    .exec()
    .then(docs => {
        if (docs.length === 0) {
            return user.save();
        } else {
            throw new Error(`User with ID ${req.body.userId} already exists`);
        }
    })
    .catch(err => {
        console.log(err);
        if (err.message) {
            err = err.message;
        }
        res.status(500).json({
            error: err
        });
    });
});

/**
 * Should be posted when a user has entered their e-mail and name, but before
 * we send them off to cognito. Sets them up in the database so that we can
 * finish registering them later.
 */
router.post('/pre-register', (req, res, next) => {
    console.log('PRE-REGISTER', req.body);
    
    const email = req.body.email;
    const name  = req.body.name;

    let user;

    User.findOne({ email: email })
    .exec()
    .then(doc => {
        if (!doc) {
            user = new User({
                _id: new mongoose.Types.ObjectId(),
                email:  email,
                name:   name,
            });
            return user.save();
        }
        else if (!doc.userId) {
            return doc;
        }
        else {
            throw new Error(`User with email ${email} already exists`);
        }
    })
    .then(result => {
        res.status(201).json({
            message: "Handling POST requests to /users/pre-register",
            createdUser: user
        });
    })
    .catch(err => {
        console.log(err);
        if (err.message) {
            err = err.message;
        }
        res.status(400).json({
            error: err
        });
    });
})

/**
 * Should be called when the user has verified their e-mail address with
 * Cognito. This will finalize them in the user DB.
 */
router.post('/verify', (req, res, next) => {
    const email             = req.body.email;
    const userId            = req.body.userId;
    const updateOperations  = {
        userId:         userId,
        description:    '',
        picture:        ''
    };

    User.update({ email: email }, { $set: updateOperations })
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
})

router.post('/:userId', (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        userId: req.params.userId,
        email: req.body.email || '',
        name: req.body.name || '',
        description: req.body.description || '',
        picture: req.body.picture || ''
    });

    User.find({ userId: req.params.userId })
    .exec()
    .then(docs => {
        if (docs.length === 0) {
            return user.save();
        } else {
            throw new Error(`User with ID ${req.params.userId} already exists`);
        }
    })
    .then(result => {
        // console.log(result);
        res.status(201).json({
            message: "Handling POST requests to /users",
            createdUser: user
        });
    })
    .catch(err => {
        console.log(err);
        if (err.message) {
            err = err.message;
        }
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.findOne({ userId: id })
    .exec()
    .then(doc => {
        // console.log(doc);
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({ message: 'No valid entry found for that user id' });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

/**
 * Queries all attached apps and returns their badgeData for the given user.
 */
router.get('/:userId/badge-data', (req, res, next) => {
    let userId = req.params.userId;

    App.find()
    .exec()
    .then(appsData => {
        let requestPromises = [];

        appsData.forEach(appData => {
            let appId           = appData.appId;
            let badgeEndpoint   = appData.badgeEndpoint;
            let appToken        = appData.appToken;

            if (badgeEndpoint && didUserAuthorizeApp(userId, appId)) {
                let requestPromise = postToRemoteBadgeEndpoint(
                    appId, badgeEndpoint, appToken, userId);

                requestPromises.push(requestPromise);
            }
        });

        return Promise.all(requestPromises);
    })
    .then(responses => {
        let results = [];
        responses.forEach(response => {
            results = results.concat(response);
        });
        res.status(200).json(results);
    })
    .catch(err => {
        console.log(err);
    })
});

function postToRemoteBadgeEndpoint(appId, badgeEndpoint, appToken, userId) {
    let headers = {
        'Authorization' : appToken,
        'UserId' : userId
    }

    let requestPromise = Axios.post(badgeEndpoint, {},
        { headers: headers })
    .then(res => res.data.badgeData)
    .catch(err => { console.log(`Error hitting badge endpoint for ${appId}: ${err.message} - Skipping`); });

    return requestPromise;
}

function didUserAuthorizeApp(userId, appId) {
    console.log("didUserAuthorizeApp");
    PermissionSet.findOne({ clientId: appId, resourceId: userId })
    .exec()
    .then(permissionSet => {
        console.log("didUserAuthorizeApp - request returned")
        return permissionSet && permissionSet.permissions.includes('DISPLAY:badge');
    })
    .then(result => {
        console.log(result);
        return result;
    })
    return true;
}

router.patch('/:userId', (req, res, next) => {
    const id = req.params.userId;
    const updateOperations = {};
    for (const ops of req.body) {
        updateOperations[ops.propName] = ops.value;
    }
    if (updateOperations.userId) {
        delete updateOperations.userId;
    }

    User.update({ userId: id }, { $set: updateOperations })
      .exec()
      .then(result => {
        // console.log(result);
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
});

router.delete("/:userId", (req, res, next) => {
    const id = req.params.userId;
    User.remove({ userId: id })
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

router.delete("/:userId/by-obj-id", (req, res, next) => {
    const id = req.params.userId;
    User.remove({ _id: id })
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