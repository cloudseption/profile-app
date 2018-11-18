const ExtApp   = require('../api/models/extApp');

function appTokenResolver(req) {
    let token = req.headers.authorization;
    return ExtApp.findOne({ appToken: token })
    .exec()
    .then(doc => {
        if (doc) {
            return doc.appId;
        } else {
            return;
        }
    })
    .catch(err => {
        console.log(err);
    })
}

module.exports = appTokenResolver;