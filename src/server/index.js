const express = require('express');
const app = express();
const os = require('os');
const auth = require('./auth/router');
const apiRouter = require('./api/router');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // TODO: Remove, depreciated.
const dotenv = require("dotenv").config();

const securityFilter = require('./security/securityFilter');
const cognitoTokenFilter = require('./security/cognitoTokenFilter');

const authProviderSingleton = require('./auth/api/v1_0_0/authProvider/AuthProvider').AuthProviderSingleton;
authProviderSingleton.config = require('./auth/api/v1_0_0/config');
authProviderSingleton.init();

const port = process.env.PORT || 8080;

const userRoutes = require('./api/routes/users');

// Connect the database
mongoose.connect(
   "mongodb://badgebook-admin:" + process.env.MONGO_ATLAS_PASSWORD + "@badge-book-shard-00-00-7gbwk.mongodb.net:27017,badge-book-shard-00-01-7gbwk.mongodb.net:27017,badge-book-shard-00-02-7gbwk.mongodb.net:27017/test?ssl=true&replicaSet=badge-book-shard-0&authSource=admin&retryWrites=true"
);

securityFilter.registerTokenFilter(cognitoTokenFilter);
securityFilter.registerPublicRoute('*:/api/permissions/*');
securityFilter.registerPublicRoute('*:/auth/*');

// Middleware
app.use(morgan('dev')); // Used for logging requests
app.use(securityFilter);
app.use(express.static('dist'));
app.use(bodyParser.urlencoded({ extended: false })); // TODO: Remove, depreciated.
app.use(bodyParser.json()); // TODO: Remove, depreciated.

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

app.get('/api/getUsername', (req, res) => { // Remove this once users api is connected to frontend
  res.send({ username: os.userInfo().username });
});

// Middleware to catch all errors
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: { message: error.message }
  });
});

app.listen(port, () => console.log(`👂  Listening on port ${port}👂`));
