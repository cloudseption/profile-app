const AuthProviderSingleton = require('./authProvider/AuthProvider').AuthProviderSingleton;

const handleRequest = async function handleRequest(req, res) {
    let authProvider = AuthProviderSingleton.getInstance();
    let cognitoToken = req.headers.cognitoaccesstoken;
    if (!cognitoToken) {
        throw new Error('Access token missing from header');
    }

    try {
        let user = await authProvider.getUserByCognitoToken(cognitoToken);
        let client = await authProvider.getClientAppByPublicKey(req.headers.clientappkey);

        let userHasEnrolled = await authProvider.hasUserEnrolledInApp(user, client);
        if (!userHasEnrolled) {
            res.send({
                notice: 'NEED_PERMISSION',
                appId: client.appId
            });
        }

        let token = await authProvider.getAccessToken(user, client);
    
        res.send({ accesstoken: token });
    } catch (err) {
        res.status(401).send({ error: err.message });
    }
}

module.exports = handleRequest;