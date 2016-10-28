var express = require('express');
var app = express();
var port = 8000;
var API = require("./api.js");
app.get('/', function(req, res){
  res.send('hello world');
});
app.get('/sendDM', function(req, res){
  res.send("Sent!");

  API.sendMessage(req.query.message);
});

app.listen(port);
console.log("I'm listening on " + port);
