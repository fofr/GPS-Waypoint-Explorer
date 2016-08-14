var express = require('express');
var router = express.Router();
var fs = require('fs');
var _ = require('underscore');
var moment = require('moment');
var colors = require('./colors');

var waypointFile = fs.readFileSync('data/data.csv');
var lines = waypointFile.toString().split('\n');
var waypoints = [];

for (var i = 0; i < lines.length; i++) {
  var line = lines[i].toString().split(',');
  if (line.length > 1) {
    var name = line[1],
        lat = line[2],
        long = line[3],
        tortoise = line[1].split('T')[0],
        date = line[1].split('T')[1],
        m = moment(date, 'YYYYMMDD'),
        year = date.substring(0,4),
        month = parseInt(date.substring(4,6), 10) - 1,
        day = parseInt(date.substring(6,8), 10) + 1,
        dateString = m.format('D MMM YYYY');

    waypoints.push({
      name: name,
      lat: lat,
      long: long,
      tortoise: tortoise,
      dateString: dateString,
      date: new Date(year, month, day)
    });
  }
}

var tortoises = {},
    colorIndex = 0;
for (var i = 0, l = waypoints.length; i < l; i++) {
  var waypoint = waypoints[i],
      tortoise = waypoint.tortoise;

  if (tortoises[tortoise]) {
    tortoises[tortoise].count = tortoises[tortoise].count + 1;
  } else {
    tortoises[tortoise] = { count: 1, color: colors[colorIndex]};
    colorIndex++;
  }

  waypoint.color = tortoises[tortoise].color;
}

router.get('/', function (req, res) {
  var tortoise = req.query.tortoise,
      filteredWaypoints = [];

  if (tortoise) {
     var tortoiseArray = tortoise.split(',');
    filteredWaypoints = _.filter(waypoints, function(waypoint){
      return _.contains(tortoiseArray, waypoint.tortoise);
    });
  } else {
    filteredWaypoints = waypoints;
  }

  res.render('index', {
    waypoints: filteredWaypoints,
    tortoises: tortoises
  });
});

// add your routes here
module.exports = router;
