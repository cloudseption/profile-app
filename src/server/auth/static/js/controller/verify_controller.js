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
        let user = this.create_cognito_user(email);

        // aws-cognito-sdk-js seems to have some weird bug with fetch, where
        // both onSuccess and onFailure get called, even though the result is
        // just fine. This is my hack to get around it. Also, the gross hack
        // where I extract the user's jwtToken and userId down below. Sorry.
        let didSucceed = false;
        user.confirmRegistration(code, true, (err, result) => {
            if (!err) {
                didSucceed      = true;
                let userId      = user.storage.userId;
                let jwtToken    = user.storage[Object.keys(user.storage).find(key => key.includes('idToken'))];
                let usefulResults = {
                    idToken: {
                        jwtToken: jwtToken,
                        payload: { sub: userId }
                    }
                };
                
                onSuccess(usefulResults);
            } else {
                if (!didSucceed) {
                    onFailure(err);
                }
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
    
                    // // I don't think I need this...
                    // (function saveCookie(cname, cvalue, exdays) {
                    //     let d = new Date();
                    //     d.setTime(d.getTime() + (exdays*24*60*60*1000));
                    //     let expires = "expires="+ d.toUTCString();
                    //     let value = cvalue + ";" + expires + ";path=/"
                    //     document.cookie = cname + "=" + value;
                    // })('cognitoToken', idToken, 365);

                    let body = {
                        email: args.email,
                        userId: result.idToken.payload.sub
                    };

                    const url = `${document.location.protocol}//${document.location.host}/api/users/verify`;
                    fetch(url, {
                        method: 'post',
                        headers: {
                            "Content-Type": "application/json; charset=utf-8",
                        },
                        body: JSON.stringify(body)
                    })
                    .then((res) => { m.verify(); })
                    .catch(err => { console.log(err); });
                },
                function verifyError(err) {
                    console.log('in verifyError', err);
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

