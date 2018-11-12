$(function () {
    let poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    let authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
        let cognitoUser = userPool.getCurrentUser();

        if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err) {
                    reject(err);
                } else if (!session.isValid()) {
                    resolve(null);
                } else {
                    resolve(session.getIdToken().getJwtToken());
                }
            });
        } else {
            resolve(null);
        }
    });

    authToken.then(function setAuthToken(token) {
        if (token) {
            return token;
        } else {
            let redirect = btoa(window.location);
            window.location.href = `index.html?redirect=${redirect}`;
        }
    })
    .then(function getSignedAccessTokenFromServer(authToken) {
        const appKey = (new URLSearchParams(document.location.search)).get('clientappkey');
        const url = `${window.location.origin}/auth/api/1.0.0/token`;
        const headers = new Headers([
            ['cognitoaccesstoken', authToken],
            ['clientappkey', appKey]
        ]);

        return fetch(url, {
            method: 'get',
            headers: headers
        });
    })
    .then(function verifyResponse(response) {
        if (response) {
            return response.json();
        }
        throw new Error('invalid response returned');
    })
    .then(function returnUserViaRedirect(jsonResponse) {
        let accessToken = jsonResponse.accesstoken;
        console.log(accessToken);
        let tokenParam = `token=${accessToken}`;
        
        let redirect64 = (new URLSearchParams(document.location.search)).get('redirect');
        if (!redirect64) {
            throw new Error('No redirect URL supplied');
        }
        let redirect = atob(redirect64);

        if (redirect.indexOf('?') < 0) {
            redirect += '?' + tokenParam;
        } else {
            redirect += '&' + tokenParam;
        }

        console.log(redirect);

        window.location = redirect;
    })
    .catch(function handleTokenError(error) {
        console.log('Error', error);
    });
});