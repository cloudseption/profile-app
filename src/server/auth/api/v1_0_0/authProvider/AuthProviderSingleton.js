const jose = require('node-jose');
const CognitoExpress = require('cognito-express');

const ClientApp = require('./ClientApp');

// Cognito Configuration (TODO: Move this somewhere external)
const cognitoExpress = new CognitoExpress({
    region: 'us-west-2',
    cognitoUserPoolId: 'us-west-2_eZyNHvuo4',
    tokenUse: 'id'
});

// Keystore Setup (TODO: Move this somewhere external)
const keystore = jose.JWK.createKeyStore();




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



    this.isPermitted = (app, user, permission) => {
    };

    /**
     * Registers a client app and initializes its JWK with the keystore.
     */
    this.registerClientApp = (app) => {
        return new Promise((resolve, reject) => {
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
     * 
     */
    this.getClientAppByKid = (kid) => {
        return Object.values(this.clientApps).find(app => app.jwk.kid == kid);
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

    /**
     * Makes sure the scope passed is registered.
     */
    this.isValidScope = (scope) => {
        return this.validScopes.includes(scope);
    }
}



/**
 * Singleton, so we maintain the same data model for the whole app.
 */
const AuthProviderSingleton = new (function AuthProviderSingleton() {
    let instance = new AuthProvider(keystore, cognitoExpress);

    this.getInstance = () => {
        return instance;
    };
});

module.exports = AuthProviderSingleton;