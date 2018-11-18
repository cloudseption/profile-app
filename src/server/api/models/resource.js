const mongoose = require('mongoose');

/**
 * Defines generic resources (URLs, badge frame, etc.) that other apps/clients
 * can interface with
 */
const resourceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    displayName: String             // What we show to the user
});

module.exports = mongoose.model('Resource', resourceSchema);