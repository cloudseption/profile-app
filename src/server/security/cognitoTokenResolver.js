const log = require('log4js').getLogger();
const CognitoExpress = require('cognito-express');
const User = require('../api/models/user');

let cognitoExpress = new CognitoExpress({
    region: 'us-west-2',
    cognitoUserPoolId: 'us-west-2_eZyNHvuo4',
    // userPoolClientId: '90tg0gak7nnh5t2415bmangqn', // Not sure if we need this or not
    tokenUse: 'id'
});

function cognitoTokenResolver(req) {
    // console.log(`CognitoTokenResolver: Begin`);
    return new Promise((resolve, reject) => {
        let token = req.cookies.cognitoToken || req.headers.authorization;

        // console.log(`CognitoTokenResolver: Try to validate token`, token);
        cognitoExpress.validate(token, function(err, response) {
            // console.log(`CognitoTokenResolver: Token validation complete`);
            if (!err) {
                log.trace(`cognitoTokenResolver: response:`, response)

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
    
    let user = await User.findOne({ userId: userId }).exec();
    if (user) {
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
    }
}

module.exports = cognitoTokenResolver;