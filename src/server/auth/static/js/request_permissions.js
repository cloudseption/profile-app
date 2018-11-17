$(function () {
    let poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    
    let appId = (new URLSearchParams(document.location.search)).get('appId');
    let authToken;
    
    new Promise(function fetchCurrentAuthToken(resolve, reject) {
        console.log('Fetching cognito token');
        let cognitoUser = userPool.getCurrentUser();

        if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err) {
                    reject(err);
                } else if (!session.isValid()) {
                    resolve();
                } else {
                    authToken = session.getIdToken().getJwtToken();
                    resolve();
                }
            });
        } else {
            resolve();
        }
    })
    .then(() => {
        let url = `${window.location.origin}/auth/api/1.0.0/permission/${appId}`;
        return fetch(`${window.location.origin}/auth/api/1.0.0/permission/${appId}`);
    })
    .then((response) => {
        return response.json();
    })
    .then(responseJson => {
        if (responseJson.error) {
            throw error;
        }
        console.log(responseJson);
    })
    .catch(error => {
        console.log(error);
    });
    
});