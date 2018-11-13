const jose = require('node-jose');
const CognitoExpress = require('cognito-express');

const ClientApp = require('./ClientApp');
const AuthUser = require('./AuthUser');



/**
 * Main auth provider class.
 * 
 * @param {jose.JWK.Keystore} keystore 
 * @param {CognitoExpress} cognitoExpress 
 */
function AuthProvider(keystore, cognitoExpress) {
    this.keystore           = keystore;
    this.cognitoExpress     = cognitoExpress;
    this.authUsers          = {};
    this.clientApps         = {};
    this.validScopes        = [];
    this.scopeDisplayNames  = [];
    this.TOKEN_LIFESPAN;

    /**
     * Returns a boolean that indicates whether or not the given user has
     * granted the given app permission to access the given scope on their
     * account.
     * 
     * @param {string | ClientApp} app A ClientApp or a string with the appId.
     * @param {string | AuthUser} user An AuthUser or a string with the uuid.
     * @param {string} scope String containing desired scope.
     */
    this.isAppUserScopePermitted = (app, user, scope) => {
        if (typeof app === 'string') {
            app = this.getClientAppByAppId(app);
        }

        if (typeof user === 'string') {
            user = this.getUserByUuid(user);
        }

        return (this.isAppRegistered(app)
            && this.isUserRegistered(user)
            && this.isValidScope(scope)
            && user.hasGrantedAccessTo(app));
    };

    /**
     * Returns true if given user has granted permissions to the given app (if
     * a user has granted permissions to the app, they are obviously enrolled
     * in it).
     * 
     * @param {string | ClientApp} app A ClientApp or a string with the appId.
     * @param {string | AuthUser} user An AuthUser or a string with the uuid.
     */
    this.hasUserEnrolledInApp = (user, app) => {
        if (typeof app === 'string') {
            app = this.getClientAppByAppId(app);
        }

        if (typeof user === 'string') {
            user = this.getUserByUuid(user);
        }
        
        return (this.isAppRegistered(app)
            && this.isUserRegistered(user)
            && user.hasGrantedAccessTo(app));
    };

    /**
     * Enrolls the user in the given app (grants permissions to it).
     * 
     * @param {string | ClientApp} app A ClientApp or a string with the appId.
     * @param {string | AuthUser} user An AuthUser or a string with the uuid.
     */
    this.enrollUserInApp = (user, app) => {
        if (typeof app === 'string') {
            app = this.getClientAppByAppId(app);
        }

        if (typeof user === 'string') {
            user = this.getUserByUuid(user);
        }

        user.grantPermissionToApp(app);
    };

    /**
     * Returns the metadata associated with the app.
     * 
     * @param {string | ClientApp} app A ClientApp or a string with the appId.
     */
    this.getAppMetadata = (app) => {
        if (typeof app === 'string') {
            app = this.getClientAppByAppId(app);
        }

        if (!app) {
            throw new Error(`${this.constructor.name} #getAppMetadata: app is not defined`);
        }

        let metadata = app.getMetadata();
        let scopeNames = [];

        metadata.scopes.forEach(scope => {
            let scopeIndex = this.validScopes.indexOf(scope);
            scopeNames.push(this.scopeDisplayNames[scopeIndex]);
        });
        metadata.scopes = scopeNames;

        return metadata;
    };

    /**
     * 
     */
    this.getAccessToken = (user, app) => {
        let jwtPayload = user.getJwtPayload();
        let secret = this.keystore.get(app.jwk);

        return jose.JWS.createSign(
            {
                fields: {
                    alg: 'HS256',
                    typ: 'jwt'
                },
                format: 'compact' },
            {
                key: secret
            }
        )
        .update(JSON.stringify(jwtPayload))
        .final()
        .then(jws => {
            return jws;
        });
    };

    /**
     * Main app onboarding function. Registers a client app and initializes its
     * JWK with the keystore. Fails if the app isn't a valid ClientApp (you
     * need to make a new one using .fromJson() first) or if any of the desired
     * scopes aren't yet registered.
     */
    this.registerClientApp = async (app) => {
        return new Promise((resolve, reject) => {
            if (!(app instanceof ClientApp)) {
                throw new Error(`${this.constructor.name} #onboardClientApp: `
                + `expected app to be of type ${ClientApp.name}, but received `
                + `${app.constructor.name}`);
            }

            // Make sure all the app's scopes are valid
            app.scopes.forEach(scope => {
                if (!this.validScopes.includes(scope)) {
                    throw new Error(`${this.constructor.name} #onboardClientApp: `
                    + `trying to register app with invalid scope ${scope}`);
                }
            });

            // Set up two-way connection with the app.
            app.authProvider = this;
            this.clientApps[app.appId] = app;

            // Create the app's JWK from its json and import it into the keystore.
            if (app.jwk) {
                keystore.add(app.jwk, 'json')
                .then((jwk) => {
                    app.jwk = jwk;
                    resolve();
                });
            }
        });
    };

    /**
     * Registers an AuthUser.
     */
    this.registerAuthUser = (user) => {
        user.authProvider = this;
        this.authUsers[user.uuid] = user;
    };

    /**
     * Registers a scope.
     */
    this.registerScope = (scope, scopeName) => {
        if (typeof scope !== 'string') {
            throw new Error(`Valid permissions must be strings, but you passed ${typeof scope}`);
        }
        this.validScopes.push(scope);
        this.scopeDisplayNames.push(scopeName);
    };

    /**
     * Returns true if the provided app is registered.
     */
    this.isAppRegistered = (app) => {
        if (app instanceof ClientApp) {
            app = app.appId;
        }

        return Boolean(this.clientApps[app]);
    };

    /**
     * Makes sure the scope passed is registered.
     */
    this.isValidScope = (scope) => {
        return this.validScopes.includes(scope);
    };

    /**
     * Returns the user associated with the given uuid.
     */
    this.getUserByUuid = (uuid) => {
        return this.authUsers[uuid];
    };

    /**
     * Returns true if the provided user is registered with the auth provider.
     */
    this.isUserRegistered = (user) => {
        return Boolean(this.authUsers[user.uuid]);
    };

    /**
     * Returns the user associated with the cognito token; throws an error if
     * token invalid or user not registered.
     */
    this.getUserByCognitoToken = async (token) => {
        let self = this;
        return new Promise((resolve, reject) => {
            cognitoExpress.validate(token,
                (err, jwt) => {
                    if (err) {
                        reject(new Error('Error validating cognito token'));
                    }

                    try {
                        let user = self.getUserByCognitoJwt(jwt);
                        resolve(user);
                    } catch (err) {
                        reject(err.message);
                    }
                });
            });
    };

    /**
     * Returns the user associated with the cognito token; throws an error if
     * token invalid or user not registered.
     */
    this.getUserByCognitoJwt = (jwt) => {
        let uuid = jwt.sub.trim();

        if (this.authUsers[uuid]) {
            return this.authUsers[uuid];
        } else {
            throw new Error(`${this.constructor.name} #getUserByCognitoJwt: `
            + `No user registered with UUID ${uuid}`);
        }
    };

    /**
     * Returns the app mapped to the given public key.
     */
    this.getClientAppByPublicKey = (kid) => {
        let app = Object.values(this.clientApps).find(app => {
            return app.jwk.kid == kid;
        });
        if (!app) {
            throw new Error(`${this.constructor.name} #getClientAppByPublicKey: `
            + `no app registered with KID ${kid}`);
        }
        return app;
    };

    /**
     * Returns the app registered with the given appId.
     */
    this.getClientAppByAppId = (appId) => {
        return this.clientApps[appId];
    };
}



AuthProvider.fromJson = async (config) => {
    let cognitoExpress = new CognitoExpress(config.cognitoExpress);
    let keystore = jose.JWK.createKeyStore();
    let authProvider = new AuthProvider(keystore, cognitoExpress);

    if (config.scopes) {
        config.scopes.forEach(scope => {
            console.log(`AuthProvider: Registering scope ${scope[0]}`);
            authProvider.registerScope(scope[0], scope[1]);
        });
    }

    if (config.clientApps) {
        for (let i=0; i < config.clientApps.length; i++) {
            let clientAppJson = config.clientApps[i];
            let clientApp = ClientApp.fromJson(clientAppJson);
            console.log(`AuthProvider: Registering client app ${clientApp.appId}`);
            await authProvider.registerClientApp(clientApp);
        }
    }

    if (config.authUsers) {
        for (let i=0; i < config.authUsers.length; i++) {
            let authUserJson = config.authUsers[i];
            let authUser = AuthUser.fromJson(authUserJson);
            console.log(`AuthProvider: Registering auth user ${authUser.uuid}`);
            await authProvider.registerAuthUser(authUser);
        }
    }

    if (config.TOKEN_LIFESPAN) {
        authProvider.TOKEN_LIFESPAN = config.TOKEN_LIFESPAN;
    }

    return authProvider;
};




/**
 * Singleton, so we maintain the same data model for the whole app.
 */
const AuthProviderSingleton = new (function AuthProviderSingleton() {
    this.config;
    let instance;

    this.init = async () => {
        instance = await AuthProvider.fromJson(this.config);
    };

    this.getInstance = () => {
        if (!instance) {
            this.init();
        }
        return instance;
    };

    /**
     * DON'T USE THIS IN PRODUCTION!!!
     * 
     * Provided so my tests actually work, because mocha doesn't reload modules
     * between each one.
     */
    this.refreshInstance = () => {
        // Cognito Configuration (TODO: Move this somewhere external)
        let defaultCognitoExpress = new CognitoExpress({
            region: 'us-west-2',
            cognitoUserPoolId: 'us-west-2_eZyNHvuo4',
            tokenUse: 'id'
        });

        // Keystore Setup (TODO: Move this somewhere external)
        let defaultKeystore = jose.JWK.createKeyStore();

        instance = new AuthProvider(defaultKeystore, defaultCognitoExpress);
    };
});

module.exports = { AuthProvider, AuthProviderSingleton };