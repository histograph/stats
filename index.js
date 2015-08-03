var redis = require('redis');
var express = require('express');
var router = express.Router();
var config = require('histograph-config');
var client = redis.createClient(config.redis.port, config.redis.host);

router.get('/queue', function(req, res) {
  client.llen(config.redis.queue, function(err, reply) {
    if (err) {
      res.status(400).send({
        message: err
      });
    } else {
      return {
        length: reply
      };
    }
  });
});

module.exports = router;
