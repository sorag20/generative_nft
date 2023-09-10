const cors = require('cors');
const { PythonShell } = require('python-shell');
const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
var path = require('path');
const formidableMiddleware = require('express-formidable');

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
  pyshell.on('message', function (data) {
    res.send('success');
  });
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './assets/' + req.body.layer);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).any();

app.post('/setImg', async function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
    } else if (err) {
      console.log(err);
    }
  });
  res.send('success');
});
