const CognitoExpress = require('cognito-express');

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
            if (err) {
                reject(`Invalid cognito token`);
            }

            // console.log(`CognitoTokenResolver: Token valid; try to extract user data. Response: `, response);
            try {
                let user = response.sub;
                // console.log(`CognitoTokenResolver: user ${user}`);
                resolve(user);
            } catch (err) {
                // console.log(`CognitoTokenResolver: Error extracting userId ${err.message}`);
                reject(err.message);
            }
        });
    });
}

module.exports = cognitoTokenResolver;