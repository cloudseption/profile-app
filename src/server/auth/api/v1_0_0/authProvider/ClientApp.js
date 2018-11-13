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
    let jsonCopy = JSON.parse(JSON.stringify(json))
    ClientApp.call(jsonCopy);
    return jsonCopy;
};

module.exports = ClientApp;