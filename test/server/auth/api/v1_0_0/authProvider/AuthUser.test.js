const mocha = require('mocha');
const assert = require('assert');

const AuthUser = require('../../../../../../src/server/auth/api/v1_0_0/authProvider/AuthUser');
const ClientApp = require('../../../../../../src/server/auth/api/v1_0_0/authProvider/ClientApp');

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

describe('AuthUser', function() {
    describe('#fromJson', function() {
        it('should return an instance of AuthUser', function() {
            let authUser = AuthUser.fromJson(mockUserData);
            assert(authUser instanceof AuthUser, `returned ${authUser.constructor.name}`);
        });
    });


    describe('#hasGrantedAccessTo', function() {
        it(`Should fail if no access granted`, function() {
            let clientApp = ClientApp.fromJson(mockAppData);
            let authUser = AuthUser.fromJson(mockUserData);

            console.log(authUser);

            assert(authUser.hasGrantedAccessTo(clientApp) === false);
        });

        it(`Should succeed if access was granted`, function() {
            let clientApp = ClientApp.fromJson(mockAppData);
            let authUser = AuthUser.fromJson(mockUserData);
            authUser.grantPermissionToApp(clientApp);
            assert(authUser.hasGrantedAccessTo(clientApp) === true);
        });
    });
});