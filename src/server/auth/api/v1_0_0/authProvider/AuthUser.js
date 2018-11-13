function AuthUser() {
    this.uuid;
    this.grants = {};
}

AuthUser.fromJson = (json) => {
    return AuthUser.call(json);
};

module.exports = AuthUser;