module.exports = (req, res) => {
    let token = req.cookies.cognitoToken;
    res.cookie('cognitoToken', token, {
        maxAge: 900000,
        httpOnly: true
    });
    res.status(200).send();
};