var fs = require('fs');
var _ = require('underscore');
var moment = require('moment');

var colors = require('./colors'),
    waypoints = require('./waypoints'),
    tortoiseMetaDataFile = fs.readFileSync('data/tortoises.csv'),
    lines = tortoiseMetaDataFile.toString().split('\n');

var tortoises = {},
    colorIndex = 0;

for (var i = 0, l = waypoints.length; i < l; i++) {
  var waypoint = waypoints[i],
      tortoise = waypoint.tortoise;

  if (tortoises[tortoise]) {
    tortoises[tortoise].count = tortoises[tortoise].count + 1;
  } else {
    tortoises[tortoise] = { number: tortoise, count: 1, color: colors[colorIndex]};
    colorIndex++;
  }

  waypoint.color = tortoises[tortoise].color;
}

for (var i = 0; i < lines.length; i++) {
  var line = lines[i].toString().split(','),
      tortoise = tortoises[line[0]];

  if (tortoise) {
    tortoise.sex = line[1];
    tortoise.v3ScuteWidth = line[2];
    tortoise.v3ScuteLength = line[3];
    tortoise.carapaceWidth = line[4];
    tortoise.carapaceLength = line[5];
    tortoise.notes = line[6];
    tortoise.name = line[7];
  }
}

module.exports = tortoises;
