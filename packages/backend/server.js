const cors = require('cors');
const { PythonShell } = require('python-shell');
const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

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

app.post('/generate/all', async function (req, res) {
  await PythonShell.run('generate_all.py', null, function (err) {
    if (err) throw err;
  });
  res.send('success');
});

app.post('/saveCID', async function (req, res) {
  //JSONファイル
  const jsonDir = fs.readdirSync('./output_json');
  const count = jsonDir.length;

  for (let i = 0; i < count; i++) {
    const jsonMetadata = await JSON.parse(
      fs.readFileSync('./output_json/' + i.toString() + '.json', 'utf8')
    );

    jsonMetadata['image'] =
      'ipfs://' + req.body.cid + '/' + i.toString() + '.png';

    fs.writeFileSync(
      './output_json/' + i.toString() + '.json',
      JSON.stringify(jsonMetadata)
    );
  }
  //csvファイル

  const csvDir = fs.readdirSync('./output_csv');
  const csvCount = csvDir.length;

  for (let i = 0; i < csvCount; i++) {
    const csvMetadata = await parse(
      fs.readFileSync('./output_csv/' + i.toString() + '.csv', 'utf8'),
      { columns: true }
    );

    csvMetadata[0]['image'] =
      'ipfs://' + req.body.cid + '/' + i.toString() + '.png';

    fs.writeFileSync(
      './output_csv/' + i.toString() + '.csv',
      stringify(csvMetadata, { header: true })
    );
  }

  res.send('success');
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
