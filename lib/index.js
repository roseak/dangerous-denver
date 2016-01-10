'use strict';

const fs = require('fs');
const _ = require('lodash');

console.time('entire process');

var worstByVariable = function(variable, columnObjects) {
  let groupedVariable = _.groupBy(columnObjects, function(obj) {
    return obj[variable];
  })

  let newGroups = Object.keys(groupedVariable).reduce(function(previous, current){
    previous[current] = groupedVariable[current].length;
    return previous;
  }, {});

  let sortedVariables = [];
  for (var entity in newGroups)
    sortedVariables.push([entity, newGroups[entity]])
  let finalVariables = sortedVariables.sort(function(a, b) {return b[1] - a[1]})
  if(variable === 'INCIDENT_ADDRESS') {
    let finalVariables = _.rest(sortedVariables)
    return finalVariables
  }
  return finalVariables
}

var parseAndGroup = function(file, variable) {
  let data = fs.readFileSync(file)
                      .toString()
                      .split('\r\n')
                      .map(row => row.split(','));

  let columnHeader = _.first(data);
  let columnData = _.rest(data);
  let columnObjects = [];

  for(var i=0; i<columnData.length; i++){
    columnObjects.push(_.zipObject(columnHeader, columnData[i]));
  }

  function filterOutCrime(obj) {
    return obj.IS_TRAFFIC === '0';
  }

  if(file === './data/crime.csv'){
    var objs = columnObjects.filter(filterOutCrime);
    columnObjects = objs;
    columnObjects;
  }

  return worstByVariable(variable, columnObjects);
}

var worstAddresses = parseAndGroup('./data/traffic-accidents.csv', 'INCIDENT_ADDRESS');
var worstNeighborhoods = parseAndGroup('./data/traffic-accidents.csv', 'NEIGHBORHOOD_ID');
var worstCrimeNeighborhoods = parseAndGroup('./data/crime.csv', 'NEIGHBORHOOD_ID');

console.timeEnd('entire process');

console.log('address: ' + worstAddresses[0]);
console.log(worstAddresses[1]);
console.log(worstAddresses[2]);
console.log(worstAddresses[3]);
console.log(worstAddresses[4]);

console.log('neighb: ' + worstNeighborhoods[0]);
console.log(worstNeighborhoods[1]);
console.log(worstNeighborhoods[2]);
console.log(worstNeighborhoods[3]);
console.log(worstNeighborhoods[4]);

console.log('crime: ' + worstCrimeNeighborhoods[0]);
console.log(worstCrimeNeighborhoods[1]);
console.log(worstCrimeNeighborhoods[2]);
console.log(worstCrimeNeighborhoods[3]);
console.log(worstCrimeNeighborhoods[4]);
