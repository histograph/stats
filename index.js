var redis = require('redis');
var express = require('express');
var router = express.Router();
var config = require('histograph-config');
var client = redis.createClient(config.redis.port, config.redis.host);
var queries = require('./queries')(config);

var CronJob = require('cron').CronJob;
var job = new CronJob({
  cronTime: '0 */15 * * * *',
  onTick: function() {
    console.log('Executing all Cypher queries...');
    queries.update();
  }
});
job.start();

router.get('/queue', function(req, res) {
  client.llen(config.redis.queue, function(err, reply) {
    if (err) {
      res.status(400).send({
        message: err
      });
    } else {
      return res.send({
        length: reply
      });
    }
  });
});

router.get('/queries', function(req, res) {
  res.send(queries.names);
});

router.get('/queries/:query', function(req, res) {
  if (queries.names.indexOf(req.params.query) > -1) {
    queries.get(req.params.query, function(err, data) {
      if (err) {
        res.status(500).send({
          message: 'Error getting query results'
        });
      } else {
        res.send(data || []);
      }
    });
  } else {
    res.status(404).send({
      message: 'Not found!'
    });
  }
});

module.exports = router;
