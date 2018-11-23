/**
 * Performs all handling for BadgeBook access tokens.
 */
function createBadgeBookTokenHandler() {
    const CLIENT_PUBLIC_KEY     = `PNgtW8zZiyhzxyRHtwtDjFMU4H_DA2_vSNJhillTjNU`;
    const REDIRECT_URL          = `${window.location.origin}/auth/token.html?client_key=${CLIENT_PUBLIC_KEY}`;
    const TOKEN_COOKIE_NAME     = `access_token`;
    const TOKEN_REGEX           = new RegExp(`${TOKEN_COOKIE_NAME}\\s*=\\s*[\\w\\d\\.\\+-]*`);

    /**
     * Pulls tokens passed back from badgebook via query strings and stores
     * them in cookies.
     */
    function extractTokenFromQueryString() {
        let url = new URL(window.location);
        if (url.searchParams.has('token')) {

            let token = url.searchParams.get('token');
            saveCookie(TOKEN_COOKIE_NAME, token, 0.1, '/');
            url.searchParams.delete('token');
            window.location = url.toLocaleString();
        }
    };


    /*
     * Checks the current token stored in cookies.
     */
    function checkCurrentToken() {
        try {
            let token         = getTokenFromCookies();
            let claims        = JSON.parse(atob(token.split('.')[1]));

            if (token) {
                if ((token ? claims.exp : 0) > Date.now()) {
                    handleValidToken(claims);
                } else {
                    handleExpiredToken();
                }
            } else {
                handleNoToken();
            }
        } catch (err) {
            handleNoToken();
        }
    };

    /*
    * Called when a valid token is detected (note, we're not testing its
    * signature here; simply making sure it exists and is not expired. You
    * should still perform proper validation on the server).
    */
    function handleValidToken(claims) {
        console.log(`User has a valid token`);

        // Example:
        // window.sessionStorage.setItem('badgebook-user-id', claims.userId);
    }


    /*
     * Called when invalid token is detected.
     */
    function handleNoToken() {
        console.log('No token found');

        // Example:
        // window.sessionStorage.deleteItem('badgebook-user-id', claims.userId);
    }


    /*
     * Called when current token is expired.
     */
    function handleExpiredToken() {
        console.log(`User token is expired`);
        clearAccessToken();
        loginWithBadgeBook();
    }


    /*
    * Call to have the user log in with BadgeBook and return with an access token.
    */
    function loginWithBadgeBook() {
        let currentUrl  = btoa(window.location);
        window.location = REDIRECT_URL + `&redirect=${currentUrl}`;
    }


    /**
     * Returns the user details from the currently stored token, or an empty
     * object otherwise.
     */
    function getCurrentUserClaims() {
        let token         = getTokenFromCookies();
        let claims        = JSON.parse(atob(token.split('.')[1]));
        return claims;
    }

    /**
     * Clears the currently stored token from cookies.
     */
    function clearAccessToken() {
        saveCookie(TOKEN_COOKIE_NAME, '', 0, '/');
    }


    /**
     * Returns the token from cookies.
     */
    function getTokenFromCookies() {
        let token;
        try {
            let cookies = document.cookie;
            tokenStr    = TOKEN_REGEX.exec(cookies)[0];
            token       = tokenStr ? tokenStr.split(`${TOKEN_COOKIE_NAME}=`)[1] : '';
        } catch (err) {
            console.log('error parsing token', err);
            token = ''; 
        }
        return token ? token : '';
    }


    /**
     * Saves a cookie.
     */
    function saveCookie(name, value, exdays, path) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        const expires   = d.toUTCString();
        document.cookie = `${name}=${value};expires=${expires};path=${path}`
    }


    extractTokenFromQueryString();
    checkCurrentToken();

    return Object.freeze({
        loginWithBadgeBook:     loginWithBadgeBook,
        getCurrentUserClaims:   getCurrentUserClaims,
        clearAccessToken:       clearAccessToken
    });
};

const badgeBookTokenHandler = createBadgeBookTokenHandler();