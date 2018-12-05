var Model = function() {
    this.signin_event = new Event(this);
}


Model.prototype = {
    // Notify view with signin action
    signin: function() {
        this.signin_event.notify();
    }
}
