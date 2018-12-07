var Model = function() {
    this.data;
    this.load_metadata_event = new Event(this);
}


Model.prototype = {
    // Notify view with register action
    load_app_metadata: function(data) {
        this.data = data;
        this.load_metadata_event.notify(data);
    }
}
