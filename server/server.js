var express = require('express');
var app = express();
var path = require('path');
var server = require('http').Server(app);
var bodyParser = require('body-parser');

require('./websockets.js')(server);

var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/../client'));

app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());


server.listen(port, function(err) {
  if(err) {
    return console.log(err);
  }
  console.log('Crunchy Tunes Server listenting on port: ' + port);
});
