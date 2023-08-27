var {PythonShell} = require('python-shell');
const express = require('express')
const app = express()
app.get('/', function(req, res){
  res.send('hello')
})
app.listen(8000)

app.post('/generate',function(req,res){
    PythonShell.run('generate.py', null, function (err, result) {
        if (err) throw err;
        console.log(result);
      });
})
