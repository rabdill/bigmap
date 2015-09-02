'use strict';

// Declare app level module which depends on views, and components
angular.module('bigmap', [
	'ngRoute',
]).
.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/default.html',
        controller: 'DefaultCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
