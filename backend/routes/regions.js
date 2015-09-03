var Region = require('../models/region').Region;
var initRegions = require('../regiondata.js').regions;  // fetch all the initial data

exports.index = function(req, res) {
  Region.find({}, function(err, docs) {
    if(!err) {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
      res.json(200, { regions: docs });
    } else {
      res.json(500, { message: err });
    }
  });
}

exports.init = function(req, res) {
  console.log("NEW GAME REQUESTED");
  Region.remove({}, function(err) {
    if(err) {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
      res.json(500, { message: "Old records could not be deleted: " + err })
    }
    console.log('Regions deleted');

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

      newRegion.save(function(err) {
        if(!err) {
          completed++;
          if(completed === total) {
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
            res.json(201, { message: "New game prepared." });
          }
        } else {
          res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
          res.json(500, {message: "Initialization failed. Could not create region '" + initRegions[region].full_name + "'. Error: " + err});
        }
      });
    } // end of the 'for' loop iterating through all the regions to create them
  }); // end of the callback attached to the "remove everything" call
}

exports.create = function(req, res) {
  var abbrev = req.body.abbrev; // abbreviation of region
  var full_name = req.body.full_name;
  var attackable = req.body.attackable; // list of neighboring regions
  var control = req.body.control; // which player controls it
  var strength = req.body.strength; // number of units garrisoned there
  var latlong = req.body.latlong; // array of lat/long shape data
  var labels = req.body.labels; // coordinates of where the labels should go

	Region.findOne({'abbrev': abbrev},
		function(err, doc) {
	    if(!err && !doc) { // if it doesn't exist yet
	      var newRegion = new Region();
        newRegion.abbrev = abbrev;
        newRegion.full_name = full_name;

        if(attackable) {
          for(var i=0, r; r = attackable[i]; i++) {
            newRegion.attackable.push(r);
          }
        }
        newRegion.control = control;
        newRegion.strength = strength;
        newRegion.latlong = latlong;
        newRegion.labels = labels;

	      newRegion.save(function(err) {
	        if(!err) {
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
	          res.json(201, {message: "Region created with name: " + newRegion.full_name });
	        } else {
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
	          res.json(500, {message: "Could not create region. Error: " + err});
	        }
	      });
	    } else if(!err) {
	      // User is trying to create a workout with a name that
	      // already exists.
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
	      res.json(403, {message: "Region with that name already exists, please update instead of create or create a new region with a different name."});
	    } else {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
	      res.json(500, { message: err});
	    }
	  }
	);
}
