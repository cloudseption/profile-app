# Badgebook Profile CORE - Deployment

Our deployment process consists of a few simple steps:

1. Build the react app using webpack.
2. Push the bundled webpack files to our S3 bucket.
3. Push our git repo to Heroku.
4. Heroku automatically invokes the "postinstall" npm script in `package.json`, which downloads the react app deployment package from S3.
5. We manually set necessary configuration variables.