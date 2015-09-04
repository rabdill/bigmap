var bigmapCtrl = angular.module('bigmapControllers', [
	'ngRoute'
]);

// all the general stuff that's always there:
//		* note to self: this is almost certainly wrong.
bigmapCtrl.controller('FrameCtrl', function ($scope, $http) {
	$http.get('http://localhost:3000/regions').success(function(data) {
		console.log(data);
  	$scope.regions = data.regions;
		$scope.player = data.player;
		$scope.units = data.units;
	});

	$scope.newGame = function() {
		$http.post('http://localhost:3000/regions/init').success(function(data) {
			$scope.message = data.message;
			console.log(data);
		});
	}

	// for filtering the region lists:
	$scope.playerRegions = function(value) {
		return value.control === $scope.player;
	}
	$scope.enemyRegions = function(value) {
		return value.control !== $scope.player;
	}
});

// Lists the currently allowed actions:
bigmapCtrl.controller('OptionsCtrl', function ($scope, $http) {
	// all the actions to test:
	actionTests = {
    'attack': function(player, regions, units) {
			var potentialTargets = false;
			for(var i=0, region; region = regions[i]; i++) {
				// find the player's regions with a unit to spare
				if(region.control == player && region.strength > 1) {
					// make sure there's an available unit in that region
					var origin = false;
					for(var i=0, unit; unit=units[i]; i++) {
						if(unit.location === region.abbrev && unit.available) {
							origin = true;
						}
					}
					if(origin) {
						// check all the neighbors of that region
						for(var i=0, potential; potential=region.attackable[i]; i++) {
							if(potential.control !== player) {
								return true;
							}
						}
					}
				}
			}
    },
    'reinforce' : function(){
			return true;
    }
	};
	// get the gamedata:
	$http.get('http://localhost:3000/regions').success(function(data) {
		$scope.regions = data.regions;
		$scope.player = data.player;
		$scope.units = data.units;
		$scope.show = {};	// whether to display the options
		for(test in actionTests) {
			$scope.show[test] = actionTests[test]($scope.player,$scope.regions,$scope.units);
		}
	});
});
