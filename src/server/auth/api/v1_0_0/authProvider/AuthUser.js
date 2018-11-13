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
    let authUser = new AuthUser();
    Object.keys(json).forEach(key => {
        if (json.key) {
            authUser[key] = json.key;
        }
    });
    return authUser;
};

module.exports = AuthUser;