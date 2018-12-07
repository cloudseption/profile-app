const log = require('log4js').getLogger();

/**
 * Lets us log things on the server from remotes.
 */
function logEndpoint(req, res, next) {
    let level   = req.body.level   ? req.body.level   : 'trace';
    let message = req.body.message ? req.body.message : '';
    let source  = req.ip;
    try {
      log[level](`Remote log from ${source}: ${message}`);
    } catch (err) {
      log.warn(`Remote log from ${source} specified invalid level ${level}. Original message was: ${message}`);
    }
    res.status(200).json(req.body);
}

module.exports = logEndpoint;