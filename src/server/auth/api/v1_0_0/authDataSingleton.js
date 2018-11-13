const jose = require('node-jose');
const PermissionDataProvider = require('./permissionDataProvider');

// Singleton Keystore for the whole app
// const keystore = jose.JWK.createKeyStore();
// keystore.generate('oct', 256).then(key => { console.log(key.toJSON(true)); });

// const permissionDataProvider = new PermissionDataProvider();
// permissionDataProvider.setupApp('hangman', 'hangman', 'www.hangman.com', 'abcdefg', ['name', 'badge'])

// module.exports = {
//     keystore: keystore,
//     permissionDataProvider: permissionDataProvider
// };