const CognitoExpress = require('cognito-express');

let cognitoExpress = new CognitoExpress({
    region: 'us-west-2',
    cognitoUserPoolId: 'us-west-2_eZyNHvuo4',
    tokenUse: 'id'
});

function cognitoTokenFilter(token) {
    return new Promise((resolve, reject) => {
        cognitoExpress.validate(token, (err, jwt) => {
            if (err) {
                reject(`Invalid cognito token`);
            }

            try {
                let user = jwt.sub;
                resolve(user);
            } catch (err) {
                reject(err.message);
            }
        });
    });
}

module.exports = cognitoTokenFilter;