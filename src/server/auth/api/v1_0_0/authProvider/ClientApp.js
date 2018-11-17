function ClientApp() {
    this.jwk;
    this.appId;
    this.displayName;
    this.appUrl;
    this.scopes = [];
    this.authProvider;

    this.toJson = () => {
        return {
            jwk:            this.jwk.toJSON(true),
            appId:          this.appId,
            displayName:    this.displayName,
            appUrl:         this.appUrl,
            scopes:         this.scopes
        };
    };

    this.getMetadata = () => {
        return {
            appId:          this.appId,
            displayName:    this.displayName,
            appUrl:         this.appUrl,
            scopes:         this.scopes
        };
    };
}

ClientApp.fromJson = (json) => {
    let instance = new ClientApp();
    let jsonCopy = JSON.parse(JSON.stringify(json));
    Object.keys(jsonCopy).forEach(key => {
        if (jsonCopy[key]) {
            instance[key] = jsonCopy[key];
        }
    });
    return instance;
};

module.exports = ClientApp;