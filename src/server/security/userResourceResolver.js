const log = require('log4js').getLogger();

const userInPathRegex = /^\/api\/users\/[\w\d\-\+\?]*/;

function userResourceResolver(req) {
    let userInPath;
    let userInHeader;

    try {
        userInPath = userInPathRegex.exec(req.path);
        userInPath = userInPath
                   ? userInPath[0].split('/api/users/').join('')
                   : null;
    } catch (err) {
        log.error(err);
    }

    return userInPath ? userInPath : undefined;
}

module.exports = userResourceResolver;