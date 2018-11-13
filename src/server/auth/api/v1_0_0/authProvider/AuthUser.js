function AuthUser() {
    this.uuid;
    this.grants = {};
    this.authProvider;

    this.grantPermissionToApp = (app) => {
        let appId = app.appId;
        this.grants[appId] = true;
    };

    this.hasGrantedAccessTo = (app) => {
        return Boolean(this.grants[app.appId]);
    };
}

AuthUser.fromJson = (json) => {
    let instance = new AuthUser();
    let jsonCopy = JSON.parse(JSON.stringify(json));
    Object.keys(jsonCopy).forEach(key => {
        if (jsonCopy[key]) {
            instance[key] = jsonCopy[key];
        }
    });
    return instance;
};

module.exports = AuthUser;