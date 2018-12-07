var View = function(model) {
    this.model = model;
    this.signin_event = new Event(this);
    this.signin_button_element = document.getElementById("signin_button");
    this.ok_button_element = document.getElementById("ok_button");
    this.modal_element = document.getElementById("modal");

    this.setup_handlers();
    this.enable();
}

View.prototype = {

    // Sets up handlers for several functions
    setup_handlers() {
        this.signin_handler = this.signin.bind(this);
        this.signin_update_handler = this.signin_update.bind(this);
    },

    // Configure listeners
    enable: function() {
        this.model.signin_event.add_listener(this.signin_update_handler);
    },

    // Accepts user input and logs the user in
    signin: function() {
        let email = document.getElementById("emailInputSignin").value;
        let password = document.getElementById("passwordInputSignin").value;
        this.signin_event.notify({
            email: email,
            password: password
        });
    },

    // Updates UI based on signin action
    signin_update: function() {
        this.modal_element.style.display = 'block';
    },


    // Initial rendering of page
    render: function() {
        this.signin_button_element.addEventListener("click", function(event){
            event.preventDefault()
        });
        this.signin_button_element.onclick = this.signin_handler;
    }
}
