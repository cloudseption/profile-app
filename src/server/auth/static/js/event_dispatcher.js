var Event = function(sender) {
    this.sender = sender;
    this.listeners = [];
}

Event.prototype = {
    add_listener: function (listener) {
        this.listeners.push(listener);
    },
    notify: function (args) {
        for (let i = 0; i < this.listeners.length; i++) {
            this.listeners[i](this.sender, args);
        }
    }
}