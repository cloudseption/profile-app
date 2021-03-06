const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Axios = require('axios');
const User = require('../models/user');
const App = require('../models/app');
const PermissionSet = require('../models/permissionSet');
const log = require('log4js').getLogger();
const AWS = require('aws-sdk');
const config = new AWS.Config();
const path = require('path');

config.update({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId:        process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:    process.env.AWS_SECRET_ACCESS_KEY
    }
});

const s3 = new AWS.S3();;

const BADGE_PERMISSION = 'DISPLAY:badge';
const LANDING_PAGE_PERMISSION = 'DISPLAY:landing-page';

router.get('/', (req, res, next) => {
    User.find()
    .exec()
    .then(docs => {
        // console.log(docs);
        res.status(200).json(docs);
    })
    .catch(err => {
        log.error(err);
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
        log.error(err);
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
    log.info(`/api/users/pre-register ${req.body.name} (${req.body.email})`)
    
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
        log.error(err);
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

    if (!userId) {
        log.error(`API call /api/users/verify - no userId found (${userId})`);
        res.status(500).json({ error: err });
    }

    User.update({ email: email }, { $set: updateOperations })
    .exec()
    .then(() => {
        // Give the user their starting permissions
        let permissionSet = new PermissionSet({
            _id: new mongoose.Types.ObjectId(),
            clientId:    userId, 
            resourceId:  userId,
            permissions: [
                `ROUTE:*:/api/users/${userId}/*`,
                `ROUTE:*:/api/permissions/${userId}/*`,
                `ROUTE:*:/api/permissions/*/${userId}`
            ]
        });

        log.trace(`Writing default permissions for user ${userId} to access their own resources`);
    
        return permissionSet.save().then(result => {
            log.trace(result);
        });
    })
    .then(() => {
        // Give the user their starting permissions
        let permissionSet = new PermissionSet({
            _id: new mongoose.Types.ObjectId(),
            clientId:    userId, 
            resourceId:  'na',
            permissions: [
                `ROUTE:*:/api/auth/token`,
                `ROUTE:*:/api/users/${userId}/*`,
                `ROUTE:*:/api/permissions/${userId}/*`,
                `ROUTE:*:/api/permissions/*/${userId}`
            ]
        });
    
        log.trace(`Writing default permissions for user ${userId} to access null resourceIds`);
        return permissionSet.save().then(result => {
            log.trace(result);
        });;
    })
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        log.error(err);
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
        log.error(err);
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
        log.error(err);
        res.status(500).json({ error: err });
    });
});

/**
 * Queries all attached apps and returns their badgeData for the given user.
 */
router.get('/:userId/badge-data', (req, res, next) => {
    log.warn(`Getting badge data`);
    let userId = req.params.userId;

    App.find()
    .exec()
    .then(appsData => {
        let requestPromises = [];
        appsData.forEach(async (appData) => {
            let appId           = appData.appId;
            let badgeEndpoint   = appData.badgeEndpoint;
            let appToken        = appData.appToken;
            let permission      = BADGE_PERMISSION;

            if (badgeEndpoint) {
                requestPromises.push(
                    didUserAuthorizeApp(userId, appId, permission)
                    .then(permissionGranted => {
                        return permissionGranted
                            ? getBadgeData(appId, badgeEndpoint, appToken, userId)
                            : [];
                    })
                );
            }
        });

        return Promise.all(requestPromises);
    })
    .then(responses => {
        let results = [];
        responses.forEach(response => {
            if (response) {
                response.forEach(entry => {
                    // Cheap error handling so the external apps don't have to change
                    if (!entry.text) {
                        entry.text = entry.data[0] || entry.name;
                    }
    
                    if (!entry['icon-url']) {
                        entry['icon-url'] = entry['img-url'];
                    }

                    results.push(entry);
                })
                
            }
        });
        res.status(200).json(results);
    })
    .catch(err => {
        log.error(err);
    })
});

/**
 * Queries all attached apps and returns userId's 
 * for users that matches the advanced search params.
 * Returns [] if none exist.
 */
router.get('/:skill/:score/score-data', (req, res, next) => {
    log.warn(`Getting userIds based on score data`);
    const skill = req.params.skill;
    const score = req.params.score;
    App.find()
        .exec()
        .then(appsData => {
            let returnedUserIds = [];
            appsData.forEach(async (appData) => {
                let appId = appData.appId;
                let skillSearchEndpoint = appData.skillSearchEndpoint;
                let appToken = appData.appToken;
                if (skillSearchEndpoint) {
                    returnedUserIds.push(
                        getProfileIds(appId, skillSearchEndpoint, appToken, skill, score)
                    );
                }
            });
            return Promise.all(returnedUserIds);
        })
        .then(responses => {
            // Flatten array of arrays of user ids
            // from the external apps into single array
            let merged = [].concat.apply([], responses);
            console.log("MERGED", merged);
            return (merged);
        })
        .then(ids => {
            User.find({ userId: { $in: ids } })
                .exec()
                .then(doc => {
                    if (doc) {
                        res.status(200).json(doc);
                    } else {
                        res.status(404).json({ message: 'No valid entry found for that user id' });
                    }
                })
                .catch(err => {
                    log.error(err);
                    res.status(500).json({ error: err });
                });
        })
        .catch(err => {
            log.error(err);
        })
});


/**
 * Queries all attached apps and returns their landingData for the given user.
 */
router.get('/:userId/landing-data', (req, res, next) => {
    let userId = req.params.userId;

    App.find()
    .exec()
    .then(appsData => {
        let requestPromises = [];
        appsData.forEach(async (appData) => {
            let appId           = appData.appId;
            let landingEndpoint = appData.landingEndpoint;
            let appToken        = appData.appToken;
            let permission      = LANDING_PAGE_PERMISSION;

            if (landingEndpoint) {
                requestPromises.push(
                    didUserAuthorizeApp(userId, appId, permission)
                    .then(permissionGranted => {
                        return permissionGranted
                            ? getLandingData(appId, landingEndpoint, appToken, userId)
                            : [];
                    })
                );
            }
        });
        return Promise.all(requestPromises);
    })
    .then(responses => {
        let results = [];
        responses.forEach(response => {
            if (response) {
                results = results.concat(response);
            }
        });
        res.status(200).json(results);
    })
    .catch(err => {
        log.error(err);
    })
});

/**
 * Requests profile data from the given remote app's endpoint.
 */
function getProfileIds(appId, searchEndpoint, appToken, skill, score) {
    return Axios.post(searchEndpoint, {
        skill: skill,
        score: score
    },
    {
        headers: {
            'Authorization': appToken,
        }
    })
    .then(res => res.data.data) 
    .catch(err => { log.error(`Error hitting skill search endpoint for ${appId}: ${err.message} - Skipping`); });
}


/**
 * Requests badge page data from the given remote app's endpoint.
 */
function getBadgeData(appId, badgeEndpoint, appToken, userId) {
    return Axios.post(badgeEndpoint, {},
        {
            headers: {
            'Authorization' : appToken,
            'userid' : userId
        }
    })
    .then(res => {
        log.info(`Badge data (${appId})\n`, `${badgeEndpoint}\n`, res.data);
        return res.data.badgeData;
    })
    .catch(err => { log.error(`Error hitting badge endpoint for ${appId}: ${err.message} - Skipping`); });
}

/**
 * Requests landing page data from the given remote app's endpoint.
 */
function getLandingData(appId, landingEndpoint, appToken, userId) {
    return Axios.post(landingEndpoint, {},
        {
            headers: {
            'Authorization' : appToken,
            'userid' : userId
        }
    })
    .then(res => {
        log.info(`getLandingData ${appId}: `, landingEndpoint, res.data);
        return res.data.landingData
    })
    .catch(err => { log.error(`Error hitting landing endpoint for ${appId}: ${err.message} - Skipping`); });
}

/**
 * Checks if the user granted the given app permission.
 */
function didUserAuthorizeApp(userId, appId, permission) {
    return PermissionSet.findOne({ clientId: appId, resourceId: userId })
    .exec()
    .then(permissionSet => {
        let permissionResult = Boolean(permissionSet) && permissionSet.permissions.includes(permission);
        return permissionResult;
    })
    .then(result => {
        log.trace(`Permissions (${appId}): `, result);
        // return result;       // Uncomment this when ready to do actual permission checking
        return true;
    })
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
        res.status(200).json(result);
      })
      .catch(err => {
        log.error(err);
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
        log.error(err);
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
        log.error(err);
        res.status(500).json({ error: err });
    });
});

/**
 * Gets the type of an image regardless of 
 * whether a file extension is in the name or not.
 */
function getImageType(arrayBuffer) {
    var type = "";
    var dv = new DataView(arrayBuffer, 0, 5);
    var nume1 = dv.getUint8(0, true);
    var nume2 = dv.getUint8(1, true);
    var hex = nume1.toString(16) + nume2.toString(16);

    switch (hex) {
        case "8950":
            type = "image/png";
            break;
        case "4749":
            type = "image/gif";
            break;
        case "424d":
            type = "image/bmp";
            break;
        case "ffd8":
            type = "image/jpeg";
            break;
        default:
            type = null;
            break;
    }
    return type;
}

//
router.post('/:userId/image', (req, res, next) => {
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let image   = req.files.profileImage;
    let imgBuffer = new ArrayBuffer(image.data.length);
    let imgType = getImageType(imgBuffer);
    let imgName = `${req.params.userId}${imgType}`;

    let params = {
        Body:           image.data,
        Bucket:         `${process.env.S3_BUCKET_NAME}/${process.env.S3_IMAGE_PATH}`,
        Key:            imgName,
        ContentType:    image.mimetype
    };

    s3.putObject(params, (err) => {
        if (err) {
            log.error('Error uploading file to S3', err);
            res.status(500).json(err);
        } else {
            const pictureUrl = `https://s3-${process.env.AWS_REGION}.amazonaws.com/${process.env.S3_BUCKET_NAME}/${process.env.S3_IMAGE_PATH}/${imgName}?cacheStop=${Date.now()}`;

            User.update({ userId: req.params.userId }, { $set: { picture: pictureUrl } }).exec()
            .then(() => res.status(200).json({ picture: pictureUrl }))
            .catch((err) => {
                log.error(`Error writing to BadgeBook database`, err);
                res.status(500).json(err);
            });
        }
    });
});

module.exports = router;
