const AuthProviderSingleton = require('./authProvider/AuthProvider').AuthProviderSingleton;

const get = async function getPermission(req, res) {
    let authProvider = await AuthProviderSingleton.getInstance();

    try {
        let appId = req.params.appId;
        let metadata = JSON.stringify(authProvider.getAppMetadata(appId));
        res.send(metadata);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ error: err.message});
    }
};

async function post(req, res) {
    let token           = req.headers.authorization;
    let appId           = req.params.appId;

    try {
        let authProvider    = await AuthProviderSingleton.getInstance();
        let user            = await authProvider.getUserByCognitoToken(token);
        let app             = await authProvider.getClientAppByAppId(appId);
        
        await authProvider.enrollUserInApp(user, app);
        res.send(JSON.stringify({ permission: 'GRANTED' }));
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ error: err.message});
    }
};

module.exports = { get, post };