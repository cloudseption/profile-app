This is here so that we can all get started working on our services with authenticated users.
Still work to be done.  Currently, users just sign up with their email addresses.  Will have to add
sign-up with username in the future.

The app connects to the User Pool I've created using information stored in /js/auth/config.js.
Most of the logic used to log user's in can be found in:
	/js/controller/register_controller.js
	/js/controller/verify_controller.js
	/js/controller/signin_controller.js

These files are passed user input from their respective view files:
	/js/view/register_view.js
	/js/view/verify_view.js
	/js/view/signin_view.js


This is an example of getting the logged in user's username when POSTing to a Python lambda
function with the authentication token:

def lambda_handler(event, context):
    event_body = json.loads(event['body'])
    username = event['requestContext']['authorizer']['claims']['cognito:username']


This is an example of getting the logged in user's username when POSTing to a Node lambda
function with the authentication token:

exports.handler = (event, context, callback) => {
    const requestBody = JSON.parse(event.body);
    const username = event.requestContext.authorizer.claims['cognito:username'];


If you have any questions, just let me kow.
