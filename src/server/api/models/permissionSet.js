const mongoose = require('mongoose');

const permissionSetSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    clientId: String,
    resourceId: String,
    permissions: [String]
});

module.exports = mongoose.model('PermissionSet', permissionSetSchema);