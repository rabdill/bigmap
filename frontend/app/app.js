'use strict';

// Declare app level module which depends on views, and components
var bigmap = angular.module('bigmap', [
	'ngRoute'
]);

bigmap.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/list.html',
        controller: 'RegionListCtrl'
      }).
			when('/new', {
        templateUrl: 'partials/list.html',
        controller: 'NewGameCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
	}
]);

bigmap.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }
]);

bigmap.controller('RegionListCtrl', function ($scope, $http) {
	$http.get('http://localhost:3000/regions').success(function(data) {
		console.log(data);
  	$scope.regions = data.regions;
	});
});

bigmap.controller('NewGameCtrl', function ($scope, $http, $location) {
	$http.post('http://localhost:3000/regions/init').success(function(data) {
		console.log(data);
  	$location.path('/');
	});
});
