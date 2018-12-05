# Badgebook Profile CORE

  - [Overview](#Overview)
  - [Quick Start](#quick-start)
    - [Development mode](#development-mode)
    - [Production mode](#production-mode)
    - [Folder Structure](#folder-structure)
    - [Expected External APIs & Services](#Expected-External-APIs-&-Services)
  - [Architecture](./documentation/architecture.md)
  - [Deployment](./documentation/deployment.md)
  - [Technologies](./documentation/technologies.md)


## Overview

This is the core application for our COMP 4711 project - a collection of applications inspired by social networks, built using a microservices architecture, which communicate using APIs.

The core application has the following responsibilities:

- Serve a web app where users can log in, create and edit profiles, and connect to the external applications.
- Provide an API, which external applications can use to query user data.
- Protect user information by requiring users to grant permissions to external applications before providing access to their information, and by requiring external applications to provide valid access tokens for all API requests.
- Provide SSO (Single Sign-On) for external applications, allowing them to use one account across multiple applications.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/cloudseption/profile-app.git

# Go inside the directory
cd profile-app

# Install dependencies
npm install

# Create a .env file in the root of the project (some of these you will have
# to procure yourself - we're not putting access keys on github):

MONGO_ATLAS_PASSWORD=<mongo-password>
LOG_LEVEL=trace
S3_BUCKET_NAME=<aws-s3-bucket-for-images>
S3_IMAGE_PATH=public/images
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=<required-for-image-upload>
AWS_SECRET_ACCESS_KEY=<required-for-image-upload>
SEARCH_ENDPOINT=https://crowdseption-search-api.herokuapp.com/api/search
SEARCH_TOKEN=80b31-1626-41b5-b21b-b0e69a

# Start development server
npm run dev

STOP HERE IF YOU'RE A DEVELOPER, THE NEXT STEPS ARE FOR DEPLOYMENT

# Build for production
npm run build

# Start production server
npm start
```

### Development mode

Here, there are 2 servers running. The front end code will be served by the [webpack dev server](https://webpack.js.org/configuration/dev-server/) which helps with hot and live reloading. The server side Express code will be served by a node server using [nodemon](https://nodemon.io/) which helps in automatically restarting the server whenever server side code changes.

### Production mode

In the production mode, there is only 1 server. All the client side code is bundled into static files using webpack and be served by the Express application.

### Folder Structure

All the code is within the **src** directory. Inside src, there are three folders.

- `Client` contains the React client-side code.
- `Auth` contains client-side code for the authentication pages (this was adapted from an earlier app in the course, hence not being integrated as part of the React app).
- `Server` contains all of the back-end server code, including MongoDB Schemas, Security Filter, and API routes.

### Expected External APIs & Services

Our application is at least partially integrated with a few external services.

#### Our Proprietary APIs

The core application consists of three separate apps:

1) The **core application** (this repo), which handles authenticating users, distributing access tokens, and presenting the profile and landing page functions.
2) The [Search Server](https://github.com/cloudseption/search-api), which handles searching the user database. In our production environment, this is hosted on a separate Heroku dyno.
3) The **BadgeBook Messenger** app, which is split into [client project](https://github.com/cloudseption/basic-firebase-chat) and [server project](https://github.com/cloudseption/basic-firebase-chat-server).

While the main application will work on its own, search and messenger functionality are dependent on the other two services.

#### External Services

Our application is built using the following key third-party services:

- [AWS Cognito](https://aws.amazon.com/cognito/), which handles initial user authentication with the main application.
- [AWS S3](https://aws.amazon.com/s3/), which is responsible for hosting the profile images, and which our application communicates with to handle profile image uploads. S3 is also part of our deployment process.
- [MongoDB](https://www.mongodb.com/), which serves as our database. We use [Mongo Atlas](https://www.mongodb.com/cloud/atlas) for hosting and database management.