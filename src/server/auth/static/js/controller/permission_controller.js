var Controller = function(model, view, authToken) {
    this.model = model;
    this.view = view;
    this.authToken;

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
        this.grant_handler = this.handle_grant.bind(this);
        this.deny_handler = this.handle_deny.bind(this);
    },

    // Configure listeners
    enable: function() {
        this.view.grant_event.add_listener(this.grant_handler);
        this.view.deny_event.add_listener(this.deny_handler);
    },

    // Loads the current cognito user
    get_cognito_user: function() {
        let cognitoUser = this.userPool.getCurrentUser();
        let self = this;
        return new Promise((resolve, reject) => {
            if (!cognitoUser) {
                // Redirect to login
            }

            cognitoUser.getSession((err, session) => {
                if (err) {
                    reject(err);
                } else if (!session.isValid()) {
                    // Redirect to login
                } else {
                    authToken = session.getIdToken().getJwtToken();
                    this.userId = session.getIdToken().payload.sub;
                    self.authToken = authToken;
                    resolve(authToken);
                }
            });
        })
    },

    // Requests app metdata from the server
    request_app_metadata: function () {
        let appId = (new URLSearchParams(document.location.search)).get('appId');
        let url = `${window.location.origin}/api/apps/${appId}`;

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

    // Forwards the user's permission grant to the server
    handle_grant: function() {
        let appId       = this.model.data.appId;
        let authToken   = this.authToken;
        let userId      = this.userId;

        this.send_grant(appId, authToken,userId )
        .then(this.redirect.bind(this))
        .catch(this.handle_error.bind(this));
    },

    // Forwards the user's permission deny to the server
    handle_deny: function() {
        this.redirect({ permission: 'DENIED' });
    },

    send_grant: function(appId, authToken, userId) {
        let permissions = this.model.data.requiredResources;
        let url = `${window.location.origin}/api/permissions/${appId}/${userId}`;
        return fetch(url,
            {
                method: "POST",
                mode: "same-origin",
                headers: {
                    'Authorization': authToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ permissions: permissions })
            })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.error) {
                    throw new Error(responseJson.error);
                }
                return responseJson;
            });
    },

    redirect: function(response) {
        let search_params   = new URLSearchParams(document.location.search);
        let redirect        = atob(search_params.get('redirect'));
        let grant_param     = `permission=${response.permission}`;

        if (redirect.indexOf('?') < 0) {
            redirect += '?' + grant_param;
        } else {
            redirect += '&' + grant_param;
        }

        window.location = redirect;
    },

    handle_error: function(err) {
        console.log("ERROR", err);
    },
}

