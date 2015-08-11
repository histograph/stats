var fs = require('fs');
var path = require('path');
var _ = require('highland');

module.exports = function(config) {
  var neo4j = require('neo4j');
  var neo4jUrl;
  if (config.neo4j.user && config.neo4j.password) {
    neo4jUrl = 'http://' + config.neo4j.user + ':' + config.neo4j.password + '@' +
      config.neo4j.host + ':' + config.neo4j.port;
  } else {
    neo4jUrl = 'http://' + config.neo4j.host + ':' + config.neo4j.port;
  }

  var db = new neo4j.GraphDatabase(neo4jUrl);
  var redis = require('redis');
  var client = redis.createClient(config.redis.port, config.redis.host);

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
  var queue = config.redis.queue + ':stats';

  function getQueryNames() {
    // Read queryDir, find all files *.cypher
    return readDir(path.join('.', queryDir))
      .filter(function(query) {
        return path.extname(query) === '.cypher';
      })
      .flatten();
  }

  var queryNames = getQueryNames();

  return {
    get: function(name, callback) {
      client.hget(queue, name, function(err, data) {
        if (err) {
          callback(err);
        } else {
          callback(err, JSON.parse(data));
        }
      });
    },

    update: function() {

      // Read files containing cypher queries, and execute cypher
      var results = queryNames
        .fork()
        .map(function(query) {
          return path.join('.', queryDir, query);
        })
        .map(readFile)
        .series()
        .map(cypher)
        .series()
        .errors(function(err) {
          console.error(err);
        });

      // zip resulting stream with original query names, write to Redis
      queryNames.fork().zip(results)
        .each(function(result) {
          var query = result[0];
          var name = path.basename(query, path.extname(query));
          client.hset(queue, name, JSON.stringify(result[1]));
        })
        .done(function() {
          client.quit();
        });
    },

    names: function(callback) {
      queryNames.fork().map(function(queryName) {
        return queryName.replace('.cypher', '');
      }).toArray(function(arr) {
        callback(arr);
      });
    }
  };
};
