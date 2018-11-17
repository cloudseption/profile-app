var View = function(model) {
    this.model = model;
    
    this.grant_event = new Event(this);
    this.deny_event = new Event(this);

    this.only_content_container = document.getElementById("only_content_container");
    this.permission_request_title = document.getElementById("permission_request_title");
    this.grant_button = document.getElementById("grant_button");
    this.deny_button = document.getElementById("deny_button");
    this.permission_list = document.getElementById("permission_list");
    this.client_app_name = document.getElementById("client_app_name");
    this.client_app_homepage = document.getElementById("client_app_homepage");

    this.setup_handlers();
    this.enable();
}

View.prototype = {

    // Sets up handlers
    setup_handlers() {
        this.load_metadata_handler = this.display_permission_request.bind(this);
        this.grant_handler = this.grant_permission.bind(this);
        this.deny_handler = this.deny_permission.bind(this);
    },

    // Configures listeners
    enable: function() {
        this.model.load_metadata_event.add_listener(this.load_metadata_handler);
    },

    // Initial rendering of page
    render: function() {
        this.grant_button.onclick = this.grant_handler;
        this.deny_button.onclick = this.deny_handler;
        // this.register_button_element.onclick = this.register_handler;
        // this.register_button_element.addEventListener("click", function(event){
        //     event.preventDefault();
        // });
        // this.ok_button_element.onclick = function() {
        //     window.location.href = "verify.html";
        // }
    },

    // Displays app metdata (name, permissions requested, etc.)
    display_permission_request: function(sender, data) {
        this.permission_request_title.innerHTML = `${data.displayName} needs permission to...`
        this.client_app_name.innerHTML = data.displayName;
        this.client_app_homepage.innerHTML = data.appUrl;
        this.client_app_homepage.href = data.appUrl;

        data.scopes.forEach(scope => {
            let element = document.createElement("li");
            let text = document.createTextNode(scope);
            element.appendChild(text);
            this.permission_list.appendChild(element);
        });

        this.only_content_container.hidden = false;
    },

    // Forwards permission grant to controller
    grant_permission: function() {
        this.grant_event.notify();
    },

    // Forwards permission denial to controller
    deny_permission: function() {
        this.deny_event.notify();
    },
}
