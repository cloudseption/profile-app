function PermissionDataProxy() {
    let appClientKeyMapping = {};
    let appData = {};
    let appUsers = {};

    this.setupApp = (appId, appName, appUrl, clientKey, permissions) => {
        if (appData[appId]) {
            throw new Error(`An app is already registered with ID ${appId}`);
        }
        appData[appId] = {
            name: appName,
            url: appUrl,
            permissions: permissions
        };
        appUsers[appId] = {};
        this.setAppClientKey(appId, clientKey);
    };

    this.setAppClientKey = (appId, clientKey) => {
        if (!appData[appId]) {
            throw new Error(`No app registered under id ${appId}`);
        }
        appClientKeyMapping[clientKey] = appId;
    };

    this.enrollUserInApp = (userId, appId) => {
        if (appData[appId]) {
            appUsers[appId][userId] = true;
        } else {
            throw new Error(`Invalid appId ${appId}`);
        }
    };

    this.userIsEnrolledInApp = (userId, appId) => {
        return Boolean(appUsers[appId][userId]);
    };

    this.getApp = (appId) => {
        return appData[appId];
    };

    this.getAppIdByClientKey = (clientKey) => {
        return appClientKeyMapping[clientKey];
    }

    this.getAppByClientKey = (clientKey) => {
        return appData[appClientKeyMapping[clientKey]];
    };
}

module.exports = PermissionDataProxy;