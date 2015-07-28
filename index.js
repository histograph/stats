var redis = require('redis');
var express = require('express');
var router = express.Router();
var config = require(process.env.HISTOGRAPH_CONFIG);
var client = redis.createClient(config.redis.port, config.redis.host);
var queues = config.redis.queues;
var async = require('async');

router.get('/queues', function(req, res) {
  async.map(Object.keys(queues), function(queueId, callback) {
    client.llen(queues[queueId], function(err, reply) {
      if (err) {
        callback(err);
      }  else {
        callback(null, {
          redisName: queues[queueId],
          queue: queueId,
          length: reply
        });
      }
    });
  },

  function(err, lengths) {
    if (err) {
      res.status(400).send({
        message: err
      });
    } else {
      res.send(lengths);
    }
  });
});

module.exports = router;
