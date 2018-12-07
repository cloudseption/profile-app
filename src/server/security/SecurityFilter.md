# Security Filter
This is a quick piece of middleware that we can use to authenticate/authorize
incoming requests to express.

## Filtering Steps
The SecurityFilter goes through the following steps:

1. Extract the client ID from the request object (see
[Token Resolvers](#token-resolvers)).
2. Extract the resource ID by running the request object through any attached 
[Resource Resolvers](#resource-resolvers).
3. Use this pair to retrieve any relevant [permissions](#permissions) from our
permissions database collection.
4. Match the current request route against all returned permissions, plus any
registered [public routes](#public-routes).
5. If a match is found, the request passes through down the middleware chain.
If not, a 401 response is returned.

During this process, the security filter attaches the `clientId`, `resourceId`,
and `permissions` objects to the ExpressJS `request` object. You can use these
for whatever you feel like.

### Notes
- The token/resource resolvers are checked in order. As soon as one is found,
they return. You shouldn't really be passing multiple resource IDs anyway
(we can't handle this in our permission system), but it's something to be aware
of.

## Token Resolvers
Token Resolvers are functions whose job is to extract a client ID from an
ExpressJS request object. They should return the extracted client ID if they
were successful, or a falsey value if they weren't.

**Prototype**
```
function MyTokenFilter(req) {
    ...
}
```

**To register a token resolver:**
```
securityFilter.registerTokenResolver(cognitoTokenFilter);
```

In general, Tokens will either come from cookies, or the `authorization` header.
The main react site is set up to store its cognito token in cookies, as this
ensures it gets sent with every request. However, for inter-app communication,
it's probably better to use the header.

## Resource Resolvers
Resource resolvers work similarly to [token resolvers](#token-resolvers). Their
job is to find a resource ID (userID, appId, whatever) from _somewhere_ in an
[ExpressJS request](https://expressjs.com/en/4x/api.html#req) object and return
that resourceID (or a falsey value if none is found).

**Prototype**
```
function MyResourceResolver(request) {
    ...
}
```

**To register a token resolver:**
```
securityFilter.registerResourceResolver(MyResourceResolver);
```

## Public Routes
You can register public routes that are accessible to everyone by registering
them with the security filter. Public routes are specified as strings, and the
format is `METHOD:/path/to/resource`. Note that you can use `*` as wildcard
characters.

**To register a public route:**
```
securityFilter.registerPublicRoute('*:/auth/*');
```

**Note:** Even if a route is public, all the checks are still performed. I did
this because A) it's simpler to implement, and B) the security filter attaches
`clientId`, `resourceId`, and `permissions` to the ExpressJS `request` object.
I figured we might want to use these later.

## Permissions
Permissions dictate what a particular "client" (whichever party sent the
request to our server) can do with a particular "resource" (e.g., a user, or
one of the external applications). There are three different parts:

1. Client
2. Resource
3. Permission (what the client is actually allowed to do)

Permissions follow one of two possible formats:

1. `ROUTE:<METHOD>:</path/to/endpoint>` - These are for incoming requests.
2. `SERVE:<badge/landing>` - These will be used by the main app when deciding
whether or not to display one of the external app's data on a user's page.

**Reference:**
- You can find the schema for permissions under `src/server/api/models/permissionSet.js`
- You can find the endpoints for setting/modifying under `src/server/api/routes/permissions.js`