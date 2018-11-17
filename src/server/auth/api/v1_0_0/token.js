const AuthProviderSingleton = require('./authProvider/AuthProvider').AuthProviderSingleton;

const handleRequest = async function handleRequest(req, res) {
    let authProvider = AuthProviderSingleton.getInstance();    
    let cognitoToken = req.headers.authorization;
    if (!cognitoToken) {
        throw new Error('Access token missing from header');
    }

    try {
        let user    = await authProvider.getUserByCognitoToken(cognitoToken);
        let client  = await authProvider.getClientAppByPublicKey(req.headers.client_key);

        let userHasEnrolled = await authProvider.hasUserEnrolledInApp(user, client);
        if (!userHasEnrolled) {
            console.log(`User ${user && user.uuid ? user.uuid : user} not enrolled in app ${client.appId}`);
            res.send({
                notice: 'NEED_PERMISSION',
                appId: client.appId
            });
        }
        else {
            let token = await authProvider.getAccessToken(user, client);
            res.send({ accesstoken: token });
        }

    } catch (err) {
        console.log(err);
        res.status(401).send({ error: err.message });
    }
}

module.exports = handleRequest;