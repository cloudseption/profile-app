var Controller = function(model, view, authToken) {
    this.model = model;
    this.view = view;

    this.poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

    this.userPool = new AmazonCognitoIdentity.CognitoUserPool(this.poolData);
    this.setup_handlers();
    this.enable();

    // Perform the initial page-load requests
    this.get_cognito_user()
    .then(this.request_app_metadata.bind(this))
    .then(this.send_data_to_model.bind(this));
}

Controller.prototype = {

    // Setup handlers
    setup_handlers: function() {
        // this.register_handler = this.handle_register.bind(this);
    },

    // Configure listeners
    enable: function() {
        // this.view.register_event.add_listener(this.register_handler);
    },

    // Loads the current cognito user
    get_cognito_user: function() {
        let cognitoUser = this.userPool.getCurrentUser();
        return new Promise(function fetchCurrentAuthToken(resolve, reject) {
            if (!cognitoUser) {
                // Redirect to login
            }

            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err) {
                    reject(err);
                } else if (!session.isValid()) {
                    // Redirect to login
                } else {
                    authToken = session.getIdToken().getJwtToken();
                    resolve(authToken);
                }
            });
        })
    },

    // Requests app metdata from the server
    request_app_metadata: function () {
        let appId = (new URLSearchParams(document.location.search)).get('appId');
        let url = `${window.location.origin}/auth/api/1.0.0/permission/${appId}`;

        return fetch(url)
        .then(response => response.json())
        .then(responseJson => {
            if (responseJson.error) {
                throw new Error(responseJson.error);
            }
            return responseJson;
        })
        .catch(err => {
            console.log(err);
        });
    },

    // Puts the received data into the model
    send_data_to_model: function (data) {
        let m = this.model;
        m.load_app_metadata(data);
    },
}

