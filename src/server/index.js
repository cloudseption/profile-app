const express = require('express');
const os = require('os');

const port = process.env.PORT || 8080;
const app = express();

app.use(express.static('dist'));

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/api/getUsername', (req, res) => {
  res.send({ username: os.userInfo().username });
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`
  );
});

app.listen(port, () => console.log(`👂  Listening on port ${port}👂`));
