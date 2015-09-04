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
			when('/attack', {
				templateUrl: 'partials/choose_target.html',
        controller: 'TargetCtrl'
      }).
			when('/attack/:tregion', {
				templateUrl: 'partials/choose_attackers.html',
        controller: 'AttackersCtrl'
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
