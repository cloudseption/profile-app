var Model = function() {
    this.verify_event = new Event(this);
    this.missing_info_error_event = new Event(this);
    this.verify_error_event = new Event(this);
}


Model.prototype = {

    // Notify view of verify action
    verify: function() {
        this.verify_event.notify();
    },

    // Notify view with error message
    missing_info_error: function() {
        this.missing_info_error_event.notify();
    },

    // Notify view with error message
    verify_error: function() {
        this.verify_error_event.notify();
    }
}
