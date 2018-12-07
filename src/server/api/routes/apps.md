# Apps API
This section of the API provides a number of endpoints for managing external
applications. This is still under development, and a few of the endpoints are
subject to change.

#### Endpoints
- [`/api/apps/`](#/api/apps)
    - GET
    - POST
- [`/api/apps/{app-id}`](#/api/apps/{app-id})
    - GET
    - PATCH
    - DELETE
- [`/api/apps/{app-id}/keypair`](#/api/apps/{app-id}/keypair)
    - POST

## Endpoints

### `/api/apps/`
Lets you onboard a new app, or interact with all currently onboarded apps.
- GET
- POST

#### GET
This is probably going to be deprecated. Returns a list of all onboarded apps.

#### POST
Lets you onboard a new application. This expects a body in the following format:

```
{
	"appId" : "hangman",
	"displayName" : "Hangman",
	"url" : "https://www.hangman.com",
	"appToken" : "appToken:2345yhgfr567uhgty",
	"requiredResources" : [
		"GET:/api/users"
	]
}
```

It will also generate a Client Key/Client Secret, attach them to your
application, and return them in the response. Here is an example:

```
{
    "message": "Set up new app hangman. Please keep your clientKey, clientSecret, and appToken safe",
    "clientKey": "8Tc5tibHepJWPz8_aKxBlf867EqnPXSiintGeGUfexA",
    "clientSecret": "6o9McYH8dd3WZGWddugdJg0CBGwpKfJas3I2nn8B_5k",
    "appToken": "appToken:2345yhgfr567uhgty"
}
```




### `/api/apps/${app-id}`
Lets you interact with your onboarded application.
- GET
- PATCH
- DELETE

#### GET
Returns details about your application's record in our database using the
following format:

```
{
    "appId": "hangman",
    "displayName": "Hangman",
    "url": "https://www.hangman.com",
    "appToken": "appToken:2345yhgfr567uhgty",
    "requiredResources": [
        "GET:/api/users"
    ]
}
```

#### PATCH
Lets you update details about your application. Expects a body with the
following format:

```
[
	{ "propName" : "appId", "value" : "hangman" },
	{ "propName" : "displayName", "value" : "Justin's Sweet Hangman Game" },
	{ "propName" : "appToken", "value" : "appToken:ju8hsdfasdbc" },
	{ "propName" : "requiredResources", "value" : [
		"GET:/api/users",
		"GET:/api/whatever"
	]}
]
```

#### DELETE
Lets you delete your application's record on our database. Warning! This is
permanent.




### `/api/apps/${app-id}/keypair`
Used to generate a new keypair for your external application. Allows:
- POST

#### POST
Doesn't expect a body. This endpoint will immediately replace your existing
Client Key/Client Secret with a new key pair. The result will be returned in
the following format:

```
{
    "message": "New client key/client secret generated for hangman.",
    "clientKey": "bMs_N1igPL3gUQi5LDxCG4Li19vPFjMYY9zXiSLFsIw",
    "clientSecret": "c3qDAbcA1XxqXwTPygn_na2lOkI0FC9dn1OJDGvTHCg"
}
```

This is a one-time view into your secret, so please save it!