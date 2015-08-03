var express = require('express');
var app = express();
var config = require('histograph-config');
var stats = require('./index');

app.use('/stats', stats);

app.listen(config.api.bindPort, function() {
  console.log(config.logo.join('\n'));
  console.log('Histograph Stats listening at port ' + config.api.bindPort);
});
