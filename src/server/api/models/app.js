const mongoose = require('mongoose');

const appSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    appId: String,
    displayName: String,
    url: String,                    // App homepage
    appToken: String,
    clientKey: String,
    clientSecret: String,           // should probably encrypt this
    requiredResources: [String]
});

module.exports = mongoose.model('App', appSchema);