var View = function(model) {
    this.model = model;
    this.register_event = new Event(this);
    this.register_button_element = document.getElementById("register_button");
    this.ok_button_element = document.getElementById("ok_button");
    this.modal_element = document.getElementById("modal");
    this.error_message_element = document.getElementById("error_message");

    this.setup_handlers();
    this.enable();
}

View.prototype = {

    // Sets up handlers
    setup_handlers() {
        this.register_handler = this.register.bind(this);
        this.register_update_handler = this.register_update.bind(this);
        this.missing_info_error_update_handler = this.missing_info_error_update.bind(this);
        this.passwords_do_not_match_error_update_handler = this.passwords_do_not_match_error_update.bind(this);
        this.failure_update_handler = this.failure_update.bind(this);
    },

    // Configures listeners
    enable: function() {
        this.model.register_event.add_listener(this.register_update_handler);
        this.model.missing_info_error_event.add_listener(this.missing_info_error_update_handler);
        this.model.passwords_do_not_match_event.add_listener(this.passwords_do_not_match_error_update_handler);
        this.model.failure_event.add_listener(this.failure_update_handler);
    },

    // Accepts input from user and registers user
    register: function() {
        let email = document.getElementById("emailInputRegister").value;
        let password = document.getElementById("passwordInputRegister").value;
        let password2 = document.getElementById("password2InputRegister").value;
        this.register_event.notify({
            email: email,
            password: password,
            password2: password2
        });
    },

    // Updates UI based on register action
    register_update: function() {
        this.modal_element.style.display = 'block';
    },

    // Initial rendering of page
    render: function() {
        this.register_button_element.onclick = this.register_handler;
        this.register_button_element.addEventListener("click", function(event){
            event.preventDefault();
        });
        this.ok_button_element.onclick = function() {
            window.location.href = "verify.html";
        }
    },

    // Displays error message
    missing_info_error_update: function() {
        this.error_message_element.style.display = 'block';
        this.error_message_element.innerHTML = error_missing_info;
    },

    // Displays error message
    passwords_do_not_match_error_update: function() {
        this.error_message_element.style.display = 'block';
        this.error_message_element.innerHTML = error_passwords_do_not_match;
    },
    
    // Displays error message
    failure_update: function() {
        this.error_message_element.style.display = 'block';
        this.error_message_element.innerHTML = error_register_failure;
    }
}
