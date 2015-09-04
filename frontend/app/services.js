var bigmapServices = angular.module('bigmapServices', ['ngResource']);

bigmapServices.factory('Finder', ['$http',
  function($http){
		var root = {};
		root.region = function(abbrev,regions,callback) {
			for(var i=0, region; region = regions[i]; i++) {
				if(region.abbrev === abbrev) {
					callback(region);
				}
			}
			return false;
		}
		return root; // what the service actually exposes
  }
]);
