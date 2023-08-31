const cors = require('cors');
const { PythonShell } = require('python-shell');
const express = require('express');
const app = express();
var bodyParser = require('body-parser');

app.get('/', function (req, res) {
  res.send('hello');
});

app.listen(8000);

app.use(
  cors(),
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.post('/generate', async function (req, res) {
  var pyshell = new PythonShell('generate.py');
  pyshell.send(req.body.count);
  let message = 'error';
  pyshell.on('message', function (data) {
    message = data;
    res.send(message);
  });
});
