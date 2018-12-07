const mongoose = require('mongoose');

const appSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  appId: String,
  displayName: String,
  url: String, // App homepage
  badgeEndpoint: String, // Go here to get badge data
  skillSearchEndpoint: String, // Go here to get userIds based on skill and score
  landingEndpoint: String, // Go here to get landing data
  appToken: String,
  clientKey: String,
  clientSecret: String, // should probably encrypt this
  requiredResources: [String]
});

module.exports = mongoose.model('App', appSchema);