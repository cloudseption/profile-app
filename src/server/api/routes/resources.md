# Resources API
Used internally to manage our directory of API resources. This is mostly just
for providing user-friendly names for all of them. You can't actually mess
that much up by changing things here.

Resources are just things your external app (or the users) can interact with
on our server. Things like `ROUTE:GET/api/users/{user-id}/name` or
`SERVE:badgeframe`. They're stuff you can ask the user for permission to use.

#### Endpoints
- [`/api/resources/`](#/api/resources)
    - GET
    - POST
    - PATCH
- [`/api/resources/{resource-id}`](#/api/resources/{resource-id})
    - DELETE

## Endpoints

### `/api/resources/`
Allows interaction with our list of resources.
- GET
- POST
- PATCH

#### GET
Returns a list of all our resources in the following format:
```
[
    {
        "_id": "5bf1ddbe5cac961e9d39529b",
        "name": "ROUTE:POST:/api/users/*",
        "displayName": "Create new users",
        "__v": 0
    },
    {
        "_id": "5bf1ddca5cac961e9d39529c",
        "name": "ROUTE:PATCH:/api/users/*",
        "displayName": "Update existing users",
        "__v": 0
    },
    ...
]
```

#### POST
Add a new resource to the directory:
```
{
	"name": "ROUTE:GET:/api/users/*",
	"displayName": "Read your user profile"
}
```
#### PATCH
Updates a current resource. Note that the resource to be updated is specified
in the body. Expects a body with the following format:
```
[
	{ "propName" : "name", "value" : "GET:/api/users/*" },
	{ "propName" : "displayName", "value" : "Read your user data" }
]
```

### `/api/resources/{resource-id}`
Allows:
- DELETE

#### DELETE
Deletes a resource by its internal MongoDB ID. Yes, I know this is lazy. You
shouldn't be deleting our resources, anyway. Just run it, passing the
mongoDB `_id` value into the `{resource-id}` parameter.