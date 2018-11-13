const mocha = require('mocha');
const assert = require('assert');

const ClientApp = require('../../../../../../src/server/auth/api/v1_0_0/authProvider/ClientApp');
const AuthProviderSingleton = require('../../../../../../src/server/auth/api/v1_0_0/authProvider/AuthProviderSingleton');

describe('AuthProvider', function() {
    it('smoke test', function() {
        let authProvider = AuthProviderSingleton.getInstance();
    });

    describe('#registerClientApp', function() {
        it('Should register the key properly', async function() {
            // Some mock data
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

            let clientApp = ClientApp.fromJson(mockAppData);
            let authProvider = AuthProviderSingleton.getInstance();

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
});