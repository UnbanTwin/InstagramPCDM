var express = require('express');
var app = express();
var port = 8000;
var bodyParser = require("body-parser");
var API = require("./api.js");
app.use("*",function(req,res,next){
    console.log(req.method + " " + req.originalUrl);
    next();
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/api/send/message', function(req, res){
    console.log(req.body);
    if (req.body.users == undefined) {
        return res.send("Missing user param");
    }
    var users = req.body.users.split(',');
    API.sendMessage(users,req.body.message,function() {
       res.send("Message sent!");
   });
});

app.get('/api/list/following',function(req,res){
    API.listFollowing(function(data){
        res.send(data);
    });
});
app.get('/api/list/threads',function(req,res){
    API.listThreads(function(data){
        res.send(data);
    });
});
app.get('/api/send/threads',function(req,res){
    API.sendToThread("340282366841710300949128113874027408665","Hello World",function(data){
        res.send(data);
    });
});


app.listen(port);
console.log("I'm listening on " + port);
