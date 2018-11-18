const mongoose      = require('mongoose');
const PermissionSet = require('../api/models/permissionSet');

const tokenAuthenticators   = [];
const resourceResolvers     = [];
const publicRoutes          = [];

/**
 * Authenticates and authorizes/rejects incoming requests.
 * 
 * Retrieves the client ID from the token in the 'authorization' header.
 * Retrieves the resource ID (based on registered resourceResolvers).
 * 
 * This pair is then checked against the permissions database + all registered
 * public routes. Success passes the request along, and failure returns a 401.
 */
async function securityFilter(req, res, next) {
    req.permissions = [];

    try {
        let clientId    = await getClientIdFromToken(req);
        req.clientId    = clientId;

        let resourceId  = await getResourceId(req);
        req.resourceId  = resourceId;

        let permissions = [];
        if (clientId) {
            permissions = await lookupPermissions(clientId, resourceId);
            req.permissions = permissions;
        }
    }
    catch (err) {
        console.log(err);
    }

    let route       = req.path;
    let method      = req.method.toUpperCase();
    let permissions = req.permissions;

    if (isRouteAuthorized(route, method, permissions)) {
        next();
    } else {
        res.status(401).json({
            error:      'unauthorized',
            clientId:   req.clientId    || 'undefined',
            resourceId: req.resourceId  || 'undefined',
            route:      req.path
        });
    }
}

/**
 * Registers a token authenticator
 */
securityFilter.registerTokenResolver = (tokenAuthenticator) => {
    tokenAuthenticators.push(tokenAuthenticator);
};

/**
 * Resources (the things clients want to operate on) may exist in a bunch of
 * possible places. Use this to register a path within the request object that
 * should be searched.
 * 
 * Use:
 * securityFilter.registerResourceResolver(['headers','userid']);
 */
securityFilter.registerResourceResolver = (path) => {
    resourceResolvers.push(path);
};

/**
 * Registers a public route. These routes are not checked for permissions.
 */
securityFilter.registerPublicRoute = (route) => {
    publicRoutes.push(makeRouteRegExp(route));
};

/**
 * Tries to pull a client from the provided token.
 * @param {Request Object} req Request to process
 */
async function getClientIdFromToken(req) {
    let client = '';
    for (let i=0; i < tokenAuthenticators.length; i++) {
        try {
            client = await tokenAuthenticators[i](req);

            if (client) {
                break;
            }
        } catch (err) {
            console.log(err);
        }
    }

    if (!client) {
        console.log('Invalid client id');
    }

    return client;
}

/**
 * Tries to find a resource ID in the request object.
 * @param {Request} req 
 */
function getResourceId(req) {
    let resourceId = '';
    for (let i=0; i < resourceResolvers.length; i++) {
        let current = resourceResolvers[i](req);
        if (current) {
            resourceId = current;
            break;
        }
    }
    return resourceId;
}

/**
 * Retrieves the permissions for the given clientId and resourceId.
 */
function lookupPermissions(clientId, resourceId) {
    if (!resourceId) {
        resourceId = 'na';
    }

    return PermissionSet.findOne({
        clientId: clientId,
        resourceId: resourceId
    })
    .exec()
    .then(grant => {
        if (grant) {
            return grant.permissions;
        } else {
            return [];
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err  });
    });
}

function isRouteAuthorized(route, method, permissions) {
    let allowedRoutes = [].concat(publicRoutes);

    permissions.forEach(permission => {
        if (! (/^ROUTE:/.test(permission))) { return; }
        permissionStr = permission.slice(6);
        allowedRoutes.push(makeRouteRegExp(permissionStr));
    });

    let incomingRoute   = `${method}:${route}`.toLowerCase();
    let matchingRule    = allowedRoutes.find(routeRule => routeRule.test(incomingRoute));
    let matches         = Boolean(matchingRule);

    // console.log('MATCHING', incomingRoute);
    // console.log('ALLOWED ROUTES', allowedRoutes);
    // console.log(matches);
    return matches;
}

function makeRouteRegExp(str) {
    let regExpStr = str.toLowerCase();
    regExpStr = regExpStr.split('*').join('.*');
    regExpStr = regExpStr.split('/.').join('[/.]');
    regExpStr = regExpStr.split('/').join('\/');
    return new RegExp(`^${regExpStr}`);
}

module.exports = securityFilter;