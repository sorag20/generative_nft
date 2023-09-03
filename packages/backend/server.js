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
  }),
  formidableMiddleware()
);
app.use(bodyParser.json());

app.post('/generate', async function (req, res) {
  var pyshell = new PythonShell('generate.py');
  pyshell.send(req.body.count);

  pyshell.on('message', function (data) {
    let message = data;
    res.send(message);
  });
});
/*
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets/1');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  dest: './assets/1/',
});
*/

app.post('/setImg', async function (req, res) {
  const request_url = req.body.request_url;
  console.log(request_url);
  try {
    const image = await fetch(request_url);
    image.body.pipe(fs.createWriteStream('./assets/1/'));
    res.send('success');
  } catch (err) {
    console.error(error);
    res.send('エラーが発生しました。');
  }
});
