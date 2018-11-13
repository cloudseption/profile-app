var Controller = function(model, view, authToken) {
    this.model = model;
    this.view = view;

    let redirect64 = (new URLSearchParams(window.location.search)).get('redirect');
    if (redirect64) {
        this.mainUrl = atob(redirect64);
    } else {
        this.mainUrl = "main.html";
    }

    this.poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

    this.userPool = new AmazonCognitoIdentity.CognitoUserPool(this.poolData);
    this.setup_handlers();
    this.enable();
}

Controller.prototype = {

    // Setup handlers
    setup_handlers: function() {
        this.signin_handler = this.handle_sign_in.bind(this);
    },

    // Configure listeners
    enable: function() {
        this.view.signin_event.add_listener(this.signin_handler);
    },

    // Sign user in to cognito
    signin: function(email, password, onSuccess, onFailure) {
        let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: email,
            Password: password
        });

        let cognitoUser = this.create_cognito_user(email);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: onSuccess,
            onFailure: onFailure
        });
    },

    // Handle sign in
    handle_sign_in: function(sender, args) {
        let mainUrl = this.mainUrl;
        this.signin(args.email, args.password,
            function signin_success() {
                window.location.href = mainUrl;
            },
            function signin_error(err) {
                document.getElementById("signin_error_message").style.display = "block";
            }
        );
    },

    // Create cognito user
    create_cognito_user: function(email) {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: this.userPool
        });
    }
}

