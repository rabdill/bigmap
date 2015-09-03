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
	// get the gamedata:
	$http.get('http://localhost:3000/regions').success(function(data) {
	});

	$scope.choices = ['choice1', 'choice2'];
});
