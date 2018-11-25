const express = require('express');
const app = express();
const os = require('os');
const path = require('path');
const auth = require('./auth/router');
const apiRouter = require('./api/router');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // TODO: Remove, depreciated.
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const dotenv = require("dotenv").config();
const log = require('log4js').getLogger();
log.level = process.env.LOG_LEVEL;

const logEndpoint = require('./log');
const securityFilter = require('./security/securityFilter');
const cognitoTokenResolver = require('./security/cognitoTokenResolver');
const appTokenResolver = require('./security/appTokenResolver');
const userResourceResolver = require('./security/userResourceResolver');

const port = process.env.PORT || 8080;

const userRoutes = require('./api/routes/users');

// Connect the database
mongoose.connect(
   "mongodb://badgebook-admin:" + process.env.MONGO_ATLAS_PASSWORD + "@badge-book-shard-00-00-7gbwk.mongodb.net:27017,badge-book-shard-00-01-7gbwk.mongodb.net:27017,badge-book-shard-00-02-7gbwk.mongodb.net:27017/test?ssl=true&replicaSet=badge-book-shard-0&authSource=admin&retryWrites=true"
);

// Middleware
app.use(cookieParser());
app.use(bodyParser({
  json: {limit: '50mb', extended: true},
  urlencoded: {limit: '50mb', extended: true}
}));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }
}));
app.use(morgan('dev')); // Used for logging requests

// Set up security Filter
securityFilter.registerTokenResolver(cognitoTokenResolver);
securityFilter.registerTokenResolver(appTokenResolver);
securityFilter.registerResourceResolver(userResourceResolver);
securityFilter.registerPublicRoute('*:/api/permissions/*');
securityFilter.registerPublicRoute('*:/api/permissions/*/*');
securityFilter.registerPublicRoute('*:/api/resources/*');
securityFilter.registerPublicRoute('*:/api/apps/*');

securityFilter.registerPublicRoute('*:/api/users/*');
securityFilter.registerPublicRoute('*:/api/users/*/badge-data');
securityFilter.registerPublicRoute('*:/api/users/pre-register');
securityFilter.registerPublicRoute('*:/api/users/verify');

securityFilter.registerPublicRoute('*:/auth/*');
securityFilter.registerPublicRoute('*:/user/*');
securityFilter.registerPublicRoute('*:/profile/*');
securityFilter.registerPublicRoute('GET:/');
securityFilter.registerPublicRoute('GET:/about');
securityFilter.registerPublicRoute('GET:/search');
securityFilter.registerPublicRoute('POST:/log');
app.use(securityFilter);

// Add CORS headers to request
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// Routes to handle requests
app.use('/auth', auth);
app.use('/api', apiRouter);
app.use('/users', userRoutes);

// Little piece of middleware for sending log notifications from the browser.
app.post('/log', logEndpoint);

// Please keep this middleware. It is important!
app.use(/^(\/([^api]|[^auth]).*)/, function allowArbitraryPathingForReact(req, res, next) {
  let fileName = /([^/])+\.([^/])+$/.exec(req.baseUrl);
  
  if (fileName) {
    fileName = fileName[0];
  } else {
    fileName = 'index.html';
  }

  let pathToFile = path.normalize(__dirname + '/../../dist/' + fileName);
  res.sendFile(pathToFile);
});
app.use(express.static('dist'));

// Middleware to catch all errors
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  log.error(error);
  res.status(error.status || 500);
  res.json({
    error: { message: error.message }
  });
});

app.listen(port, () => console.log(`👂  Listening on port ${port}👂`));
