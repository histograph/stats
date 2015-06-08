var fs = require('fs');
var path = require('path');
var _ = require('highland');
var config = require(process.env.HISTOGRAPH_CONFIG);
var neo4j = require('neo4j');
var url = 'http://' + config.core.neo4j.host + ':' + config.core.neo4j.port;
var redis = require('redis');
var client = redis.createClient(config.redis.port, config.redis.host);
var db = new neo4j.GraphDatabase(url);
var queues = config.redis.queues;

var readDir = _.wrapCallback(fs.readdir);
var readFile = _.wrapCallback(function(filename, callback) {
  return fs.readFile(filename, {encoding: 'utf8'}, callback);
});
var cypher = _.wrapCallback(function(query, callback) {
  return db.cypher({
    query: query
  }, callback);
});

var queryDir = 'queries';

var queries = readDir(path.join('.', queryDir))
  .filter(function(query) {
    return path.extname(query) === '.cypher';
  })
  .flatten();

var results = queries
  .fork()
  .map(function(query) {
    return path.join('.', queryDir, query);
  })
  .map(readFile)
  .series()
  .map(cypher)
  .series()
  .errors(function(err) {
    console.error(err)
  });

queries.fork().zip(results)
  .each(function(result) {
    var query = result[0];
    var name = path.basename(query, path.extname(query))
    client.hset(config.redis.queues.stats, name, JSON.stringify(result[1]));
  })
  .done(function() {
    client.quit();
  });
