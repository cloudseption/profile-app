var Model = function() {
    this.register_event = new Event(this);
    this.missing_info_error_event = new Event(this);
    this.passwords_do_not_match_event = new Event(this);
    this.failure_event = new Event(this);
}


Model.prototype = {
    // Notify view with register action
    register: function() {
        this.register_event.notify();
    },

    // Notify view with error message
    missing_info_error: function() {
        this.missing_info_error_event.notify();
    },

    // Notify view with error message
    passwords_do_not_match_error: function() {
        this.passwords_do_not_match_event.notify();
    },

    // Notify view with error message
    failure: function() {
        this.failure_event.notify();
    }
}
