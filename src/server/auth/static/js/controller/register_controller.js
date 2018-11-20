var Controller = function(model, view, authToken) {
    this.model = model;
    this.view = view;
    this.verifyUrl = "verify.html";

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
        this.register_handler = this.handle_register.bind(this);
    },

    // Configure listeners
    enable: function() {
        this.view.register_event.add_listener(this.register_handler);
    },

    // Register user with cognito
    register: function (name, email, password, onSuccess, onFailure) {
        console.log("register");
        let dataEmail = {
            Name: 'email',
            Value: email
        };

        fetch(`/api/users/pre-register`, {
            method: 'post',
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                email: email,
                name: name
            })
        })
        .then((res) => {
            console.log(res);
            let attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
            this.userPool.signUp(email, password, [attributeEmail], null,
                function signUpCallback(err, result) {
                    if (!err) {
                        onSuccess(result);
                    } else {
                        console.log(err);
                        onFailure(err.message || err);
                    }
                }
            );
        })
        .catch(err => {
            if (err.text) {
                err = err.text();
            }
            console.log(err);
            onFailure(err.message || err);
        });
    },

    handle_register: function (sender, args) {
        let m = this.model;
        let on_success = function register_success(result) {
            let cognitoUser = result.user;
            m.register();
        };
        let on_failure = function register_failure(err) {
            m.failure();
        };

        if (args.password == '' || args.password2 == '' || args.email == '' || args.name == '') {
            m.missing_info_error();
        }
        else if (args.password !== args.password2) {
            m.passwords_do_not_match_error();
        } else {
            this.register(args.name, args.email, args.password, on_success, on_failure);
        }
    }
}

