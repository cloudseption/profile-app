var Controller = function(model, view, authToken) {
    this.model = model;
    this.view = view;

    let redirect64 = (new URLSearchParams(window.location.search)).get('redirect');
    if (redirect64) {
        this.mainUrl = atob(redirect64);
    } else {
        this.mainUrl = `${window.location.origin}`;
    }

    this.poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId,
        Storage: new AmazonCognitoIdentity.CookieStorage({
            domain: document.location.hostname,
            secure: false
        })
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
        console.log('signing in');
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
            function signin_success(result) {
                console.log('signin success', result);
                let idToken = result.idToken.jwtToken;
                let userId  = result.idToken.payload.sub;

                // I don't think I need this...
                (function saveCookie(cname, cvalue, exdays) {
                    let d = new Date();
                    d.setTime(d.getTime() + (exdays*24*60*60*1000));
                    let expires = "expires="+ d.toUTCString();
                    let value = cvalue + ";" + expires + ";path=/"
                    document.cookie = cname + "=" + value;
                })('cognitoToken', idToken, 365);

                // Ping the server. This is partially to let us log when users
                // sign in, and partially to solve the issue I was having with
                // completing registration.
                fetch(`${window.location.origin}/log`, {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: `User ${userId} logged in` })
                })
                .then(result => {
                    window.localStorage.setItem('userId', userId);
                })
                .then(result => {
                    // Redirect
                    let redirect64 = (new URLSearchParams(document.location.search)).get('redirect');
                    let redirect = redirect64
                                 ? atob(redirect64)
                                 : `${window.location.origin}/`;
                    window.location = redirect;
                });

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

