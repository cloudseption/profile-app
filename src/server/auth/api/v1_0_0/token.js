const jose = require('node-jose');
const keystore = require('./authDataSingleton').keystore;
const CognitoExpress = require('cognito-express');

const cognitoExpress = new CognitoExpress({
    region: 'us-west-2',
    cognitoUserPoolId: 'us-west-2_eZyNHvuo4',
    tokenUse: 'id'
})

const TOKEN_LIFESPAN = 3600000;

const handleRequest = function handleRequest(req, res) {
    (new Promise(function validateCognitoToken(resolve, reject) {
        let cognitoToken = req.headers.cognitoaccesstoken;
        if (!cognitoToken) {
            reject(new Error('Access token missing from header'));
        }
        cognitoExpress.validate(
            cognitoToken,
            function generateAppAccessToken(err, response) {
                if (err) {
                    reject(new Error('Error validating cognito token'));
                }
                resolve(response);
            });
    }))


    .then(function buildJwtPayload(cognitoResponse) {
        return {
            sub: cognitoResponse.sub,
            email: cognitoResponse.email,
            iat: Date.now(),
            exp: Date.now() + TOKEN_LIFESPAN
        };
    })


    .then(function getJwkForApp(jwtPayload) {
        return {
            payload: jwtPayload,
            secret: keystore.get(req.headers.clientappkey)
        };
    })


    .then(function signJwt(params) {
        return jose.JWS.createSign(
            {
                fields: {
                    alg: 'HS256',
                    typ: 'jwt'
                },
                format: 'compact' },
            {
                key: params.secret
            }
        )
        .update(JSON.stringify(params.payload))
        .final()
        .then(jws => {
            console.log(jws);
            return jws;
        });
    })


    .then(function returnJws(jws) {
        return res.send({ accesstoken: jws });
    })
    

    .catch(err => {
        console.log(err);
        return res.status(401).send(err.message);
    });
}

module.exports = handleRequest;