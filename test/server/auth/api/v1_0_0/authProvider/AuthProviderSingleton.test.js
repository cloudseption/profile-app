const mocha = require('mocha');
const assert = require('assert');

const ClientApp = require('../../../../../../src/server/auth/api/v1_0_0/authProvider/ClientApp');
const AuthUser = require('../../../../../../src/server/auth/api/v1_0_0/authProvider/AuthUser');
const authProviderSingleton = require('../../../../../../src/server/auth/api/v1_0_0/authProvider/AuthProvider').AuthProviderSingleton;

const mockAppData = Object.freeze({
    appId: `hangman`,
    displayName: `Justin's Sweet Hangman App`,
    appUrl: `www.example.com`,
    scopes: [ `USER:BADGE:WRITE`, `USER:DISPLAY_NAME:READ` ],
    jwk: {
        kty: 'oct',
        kid: 'lyqevCQV_OPgR3gnFk-pHvEQh8GdVaBX5MJIuIktW6g',
        k: 't0q72YCbgpIt7L4bbOM69_Q5cGymlCXtxZglyNet5bE'
    }
});

const mockUserData = Object.freeze({
    uuid:       '1234567890',
    grants:     {}
});

function refreshSingletonInstances() {
    authProviderSingleton.refreshInstance();
}

describe('AuthProvider', function() {
    beforeEach(refreshSingletonInstances);

    it('smoke test', function() {
        let authProvider = authProviderSingleton.getInstance();
    });

    describe('#registerClientApp', function() {
        beforeEach(refreshSingletonInstances);

        it('Should register the key properly', async function() {
            let clientApp = ClientApp.fromJson(mockAppData);
            let authProvider = authProviderSingleton.getInstance();

            // Register scopes
            mockAppData.scopes.forEach(scope => {
                authProvider.registerScope(scope);
            });

            await authProvider.registerClientApp(clientApp);

            assert(authProvider.keystore.all().length > 0);
            assert(clientApp.jwk.constructor.name === 'JWKBaseKeyObject');
            assert(clientApp.jwk === authProvider.keystore.get(mockAppData.jwk.kid));
        });
    });



    describe('#isAppUserScopePermitted', function() {
        beforeEach(refreshSingletonInstances);

        it('Should return true if all factors are in place', function() {
            let app = ClientApp.fromJson(mockAppData);
            let user = AuthUser.fromJson(mockUserData);
            let authProvider = authProviderSingleton.getInstance();
            let scope = mockAppData.scopes[0];

            // Register scopes
            mockAppData.scopes.forEach(scope => {
                authProvider.registerScope(scope);
            });

            authProvider.registerClientApp(app);
            user.grantPermissionToApp(app)

            assert(authProvider.isAppUserScopePermitted(app, user, scope) === true);
        });


        it('Should fail if app not registered', function() {
            let app = ClientApp.fromJson(mockAppData);
            let user = AuthUser.fromJson(mockUserData);
            let authProvider = authProviderSingleton.getInstance();
            let scope = mockAppData.scopes[0];

            user.grantPermissionToApp(app)

            assert(authProvider.isAppUserScopePermitted(app, user, scope) === false);
        });


        it('Should fail if scope not registered', async function() {
            let app = ClientApp.fromJson(mockAppData);
            let user = AuthUser.fromJson(mockUserData);
            let authProvider = authProviderSingleton.getInstance();
            let scope = mockAppData.scopes[0];

            // Register scopes
            authProvider.registerScope(mockAppData.scopes[1]);

            authProvider.registerClientApp(app);
            user.grantPermissionToApp(app)

            assert(authProvider.isAppUserScopePermitted(app, user, scope) === false);
        });
    });
});