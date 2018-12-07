const log = require('log4js').getLogger();
const CognitoExpress = require('cognito-express');
const User = require('../api/models/user');
const PermissionSet = require('../api/models/permissionSet');
const mongoose = require('mongoose');

let cognitoExpress = new CognitoExpress({
    region: 'us-west-2',
    cognitoUserPoolId: 'us-west-2_eZyNHvuo4',
    // userPoolClientId: '90tg0gak7nnh5t2415bmangqn', // Not sure if we need this or not
    tokenUse: 'id'
});

const knownRegisteredUsers = {};

function cognitoTokenResolver(req) {
    // console.log(`CognitoTokenResolver: Begin`);
    return new Promise((resolve, reject) => {
        let token = req.cookies.cognitoToken || req.headers.authorization;

        // console.log(`CognitoTokenResolver: Try to validate token`, token);
        cognitoExpress.validate(token, function(err, response) {
            // console.log(`CognitoTokenResolver: Token validation complete`);
            if (!err) {
                // log.trace(`cognitoTokenResolver: response:`, response)

                makeSureUserIsRegistered(response);
                if (response && response.sub) {
                    let user = response.sub;
                    resolve(user);
                    return;
                }
            }
            
            reject(`Invalid cognito token`);
        });
    });
}

async function makeSureUserIsRegistered(tokenPayload) {
    let userId = tokenPayload.sub;
    let email = tokenPayload.email;

    // If we already know the user is registered, return.
    if (knownRegisteredUsers[userId]) {
        return;
    }
    
    let user = await User.findOne({ userId: userId }).exec();
    if (user) {
        knownRegisteredUsers[userId] = true;
        return;
    }

    log.info(`cognitoTokenResolver: Detected token from unregistered user ${userId}, ${email}.`);
    user = await User.findOne({ email: email }).exec();
    if (!user) {
        log.warn(`cognitoTokenResolver: Could not find user by userId OR email (${userId}, ${email})`);
        return;
    } else {
        log.info(`cognitoTokenResolver: found unregistered user by email (${userId}, ${email}). Completing registration`);
        const updateOperations  = {
            userId:         userId,
            description:    '',
            picture:        ''
        };
        User.update({ email: email }, { $set: updateOperations }).exec()
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
        });

        knownRegisteredUsers[userId] = true;
    }
}

module.exports = cognitoTokenResolver;