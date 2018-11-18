const App   = require('../api/models/app');

function appTokenResolver(req) {
    let token = req.headers.authorization;
    return App.findOne({ appToken: token })
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