var Region = require('../models/region').Region;
var Game = require('../models/game').Game;
var Unit= require('../models/unit').Unit;
var initRegions = require('../regiondata.js').regions;  // fetch all the initial data

exports.index = function(req, res) {
  Region.find({}, function(err, regions) {
    if(!err) {
      Game.find({}, function(err,game) {
        if(err) {
          res.json(500, { message: err});
        }
        Unit.find({}, function(err,units) {
          if(err) {
            res.json(500, { message: err});
          }
          res.json(200, {
            regions: regions,
            player: game[0].current_player,
            units: units
          });
        });
      });
    } else {
      res.json(500, { message: err });
    }
  });
}

exports.init = function(req, res) {
  console.log("NEW GAME REQUESTED");
  Region.remove({}, function(err) {
    if(err) {
      res.json(500, { message: "Old records could not be deleted: " + err })
    }
    console.log('Regions deleted');
    // delete the old units:
    Unit.remove({}, function(err) {
      if(err) {
        res.json(500, {message: "Initialization failed. Could not create new unit. Error: " + err});
      }
    });

    // create the new regions:
    var completed = 0;
    var total = Object.keys(initRegions).length; // all the regions

    for(region in initRegions) {
      var newRegion = new Region();
      console.log("Starting creation process for " + region);
      newRegion.abbrev = region;
      newRegion.full_name = initRegions[region].full_name;
      if(initRegions[region].attackable) {
        for(var i=0, r; r = initRegions[region].attackable[i]; i++) {
          newRegion.attackable.push(r);
        }
      }
      newRegion.control = initRegions[region].control;
      newRegion.strength = initRegions[region].strength;
      newRegion.latlong = initRegions[region].latlong;
      newRegion.labels = initRegions[region].labels;

      // create new units, put em in the region:
      for(var i=0; i < newRegion.strength; i++) {
        var newUnit = new Unit();
        newUnit.location = region;
        newUnit.save(function(err) {
          if(!err) {
            console.log("Made a unit!");
          } else {
            res.json(500, {message: "Initialization failed. Could not create new unit. Error: " + err});
          }
        });
      }

      // save the region (doesn't have to wait for the units?!)
      newRegion.save(function(err) {
        if(!err) {
          completed++;
          if(completed === total) {
            Game.remove({}, function(err) {
              if(err) {
                res.json(500, { message: "Old games could not be deleted: " + err })
              }
              console.log('Games deleted');

              var newGame = new Game();
              console.log("Starting creation process for new game");
              newGame.current_player = 'Rebels';
              newGame.save(function(err) {
                if(!err) {
                    res.json(201, { message: "New game prepared." });
                } else {
                  res.json(500, {message: "Initialization failed. Could not create new game. Error: " + err});
                }
              });
            }); // end of the callback attached to the "remove game" call
          }
        } else {
          res.json(500, {message: "Initialization failed. Could not create region '" + initRegions[region].full_name + "'. Error: " + err});
        }
      });
    } // end of the 'for' loop iterating through all the regions to create them
  }); // end of the callback attached to the "remove all regions" call
}
