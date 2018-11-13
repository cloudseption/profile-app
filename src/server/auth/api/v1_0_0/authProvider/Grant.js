function Grant() {
    this.user;
    this.app;
    this.scope;
}

Grant.fromJson = (json) => {
    return Grant.call(json);
};

module.exports = Grant;