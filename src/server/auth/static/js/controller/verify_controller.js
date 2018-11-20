var Controller = function(model, view, authToken) {
    this.model = model;
    this.view = view;
    this.signinUrl = "index.html";

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
        this.verify_handler = this.handleVerify.bind(this);
    },

    // Configure listeners
    enable: function() {
        this.view.verify_event.add_listener(this.verify_handler);
    },

    // Verify user with cognito
    verify: function(email, code, onSuccess, onFailure) {
        this.create_cognito_user(email).confirmRegistration(code, true, (err, result) => {
            if (!err) {
                onSuccess(result);
            } else {
                onFailure(err);
            }
        });
    },

    // Handle verification
    handleVerify: function(sender, args) {
        let m = this.model;
        if (args.email == "" || args.code == "") {
            m.missing_info_error();
        } else {
            this.verify(args.email, args.code,
                function verifySuccess(result) {
                    let idToken = result.idToken.jwtToken;
                    console.log(idToken);
    
                    ((cname, cvalue, exdays) => {
                        console.log('saving')
                        let d = new Date();
                        d.setTime(d.getTime() + (exdays*24*60*60*1000));
                        let expires = "expires="+ d.toUTCString();
                        let value = cvalue + ";" + expires + ";path=/"
    
                        console.log(cname, value);
    
                        document.cookie = cname + "=" + value;
                    })('cognitoToken', idToken, 365);

                    console.log(`let result = ${JSON.stringify(result)}`);

                    console.log('Verifying user...');
                    fetch(`/api/users/verify`, {
                        method: 'post',
                        headers: {
                            "Content-Type": "application/json; charset=utf-8",
                        },
                        body: JSON.stringify({
                            email: email,
                            userId: result.idToken.payload.sub
                        })
                    })
                    .then((res) => {
                        console.log(res);
                        m.verify();
                    })
                    .catch(err => {
                        console.log(err);
                    });
                },
                function verifyError(err) {
                    console.log(err);
                    m.verify_error();
                }
            );
        }

    },

    create_cognito_user: function(email) {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: this.userPool
        });
    }
}

