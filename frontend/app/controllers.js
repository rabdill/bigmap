var bigmapCtrl = angular.module('bigmapControllers', [
	'ngRoute'
]);

bigmapCtrl.controller('RegionListCtrl', function ($scope, $http) {
	$http.get('http://localhost:3000/regions').success(function(data) {
		console.log(data);
  	$scope.regions = data.regions;
		$scope.player = data.player;
	});
});

bigmapCtrl.controller('NewGameCtrl', function ($scope, $http, $location) {
	$http.post('http://localhost:3000/regions/init').success(function(data) {
		console.log(data);
  	$location.path('/');
	});
});
