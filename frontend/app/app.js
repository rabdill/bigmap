'use strict';

// Declare app level module which depends on views, and components
var bigmap = angular.module('bigmap', [
	'ngRoute',
	'bigmapControllers'
]);

bigmap.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
				templateUrl: 'partials/options.html',
        controller: 'OptionsCtrl'
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
