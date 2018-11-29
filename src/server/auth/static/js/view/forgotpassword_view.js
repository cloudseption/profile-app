var View = function() {
    this.test_button_element                 = document.getElementById("test_button");
    this.verify_new_password_button_element  = document.getElementById("verify_new_password_button");
    this.new_password_input_element          = document.getElementById("new_password_input");
    this.confirm_new_password_element        = document.getElementById("confirm_new_password_input");
    this.modal_element                       = document.getElementById("modal");
    this.verify_new_password_input_element   = document.getElementById("verification_code_input");
    this.error_message_element               = document.getElementById("error_message");
    this.email_element                       = document.getElementById("emailInputInitForgottenPassword");
    
    this.cognitoUser = {};
    this.setup_handlers();
}

View.prototype = {

    setup_handlers() {
        this.confirm_new_password_handler = this.confirm_new_password.bind(this);
        this.init_forgotten_password_handler = this.init_forgotten_password.bind(this);
    },

    render: function() {
        this.test_button_element.onclick                 = this.init_forgotten_password_handler;
        this.verify_new_password_button_element.onclick  = this.confirm_new_password_handler;
    },

    create_cognito_user: function(email) {
        let poolData = {
            UserPoolId: _config.cognito.userPoolId,
            ClientId: _config.cognito.userPoolClientId
        };
        let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        return new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: userPool
        });
    },
    
    confirm_new_password: function () {
        let new_password            = this.new_password_input_element.value;
        let confirm_new_password    = this.confirm_new_password_element.value;
        let verification_code       = this.verify_new_password_input_element.value;
    
        if (new_password != confirm_new_password) {
            this.passwords_do_not_match_error_update()
        } else {
            cognitoUser.confirmPassword(verification_code, new_password, {
                onFailure(err) {
                    console.log(JSON.stringify(err, null, 4));
                },
                onSuccess() {
                    window.location.href = "login.html"
                },
            });
        }
    },

    init_forgotten_password: function () {
        let modal_element = this.modal_element;
        cognitoUser = this.create_cognito_user(this.email_element.value);
        cognitoUser.forgotPassword({
            onSuccess: function (result) {
                modal_element.style.display = 'block';
            },
            onFailure: function(err){
                console.log(JSON.stringify(err, null, 4));
            }
        });
    },
    
    passwords_do_not_match_error_update: function() {
        this.error_message_element.style.display    = 'block';
        this.error_message_element.innerHTML        = error_passwords_do_not_match;
    }
}
