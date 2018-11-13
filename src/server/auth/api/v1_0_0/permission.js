const AuthProviderSingleton = require('./authProvider/AuthProvider').AuthProviderSingleton;

const get = async function getPermission(req, res) {
    console.log('GET PERMISSIONS');
    let authProvider = await AuthProviderSingleton.getInstance();

    console.log(req.params);

    try {
        let appId = req.params.appId;
        let metadata = JSON.stringify(authProvider.getAppMetadata(appId));
        console.log(metadata);
        res.send(metadata);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ error: err.message});
    }
};

async function post(req, res) {
    
};

module.exports = { get, post };