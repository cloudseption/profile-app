const jose = require('node-jose');
const CognitoExpress = require('cognito-express');

const ClientApp = require('./ClientApp');



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

    /**
     * Returns a boolean that indicates whether or not the given user has
     * granted the given app permission to access the given scope on their
     * account.
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
     * Registers a client app and initializes its JWK with the keystore.
     */
    this.registerClientApp = (app) => {
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
    this.registerScope = (scope) => {
        if (typeof scope !== 'string') {
            throw new Error(`Valid permissions must be strings, but you passed ${typeof scope}`);
        }
        this.validScopes.push(scope);
    };

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

    this.isUserRegistered = (user) => {
        return Boolean(this.authUsers[user.uuid]);
    };

    /**
     * Returns the user associated with the cognito token; throws an error if
     * token invalid or user not registered.
     */
    this.getUserByCognitoToken = async (token) => {
        let userJwt = await new Promise((resolve, reject) => {
            cognitoExpress.validate(
                token,
                function generateAppAccessToken(err, jwt) {
                    if (err) {
                        reject(new Error('Error validating cognito token'));
                    }
                    resolve(jwt);
                });
            });
        
        console.log(jwt);
    };

    /**
     * Returns the user associated with the cognito token; throws an error if
     * token invalid or user not registered.
     */
    this.getUserByCognitoJwt = (jwt) => {
        let uuid = jwt.sub;

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
        return Object.values(this.clientApps).find(app => app.jwk.kid == kid);
    };

    /**
     * Returns the app registered with the given appId.
     */
    this.getClientAppByAppId = (appId) => {
        return this.clientApps[appId];
    };
}



/**
 * Singleton, so we maintain the same data model for the whole app.
 */
const AuthProviderSingleton = new (function AuthProviderSingleton() {
    let instance;

    this.getInstance = () => {
        if (!instance) {
            this.refreshInstance();
        }
        return instance;
    };

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