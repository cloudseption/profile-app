$(function () {
    let poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    let params = new URLSearchParams(document.location.search);
    let permission = params.get('permission');


    let authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
        console.log('Fetching cognito token');
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
        console.log('Making sure token exists');
        if (token) {
            return token;
        } else {
            let redirect = btoa(window.location);
            window.location.href = `index.html?redirect=${redirect}`;
        }
    })
    .then(function getSignedAccessTokenFromServer(authToken) {
        console.log('Requesting signed access token');
        const appKey = (new URLSearchParams(document.location.search)).get('client_key');
        const url = `${window.location.origin}/api/auth/token`;

        return fetch(url,
            {
                method: 'get',
                headers: {
                    authorization: authToken,
                    client_key: appKey
                }
            });
    })
    .then(function verifyResponse(response) {
        console.log('Verifying response');
        console.log(response);
        try {
            return response.json();
        } catch (err) {
            console.log(response);
            throw err;
        }
    })
    .then(function returnUserViaRedirect(jsonResponse) {
        if (jsonResponse.error) {
            console.log(jsonResponse.error);
        }
        else if (permission && permission !== 'GRANTED') {
            console.log("You didn't grant permission to the app")
        }
        else if (jsonResponse.notice === 'NEED_PERMISSION') {
            console.log("need permissions");
            let redirect = btoa(window.location);
            window.location.href = `permission.html?redirect=${redirect}&appId=${jsonResponse.appId}`;
        }
        else {
            console.log('Triggering redirect');
            let accessToken = jsonResponse.accesstoken;
            let tokenParam = `token=${accessToken}&permission=${permission}`;
            
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
        }
    })
    .catch(function handleTokenError(error) {
        console.log('Error', error);
    });
});