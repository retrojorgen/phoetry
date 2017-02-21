var phoetry = angular.module('Phoetry', ['ngRoute']);

angular.module('Phoetry').config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {

	$locationProvider.html5Mode(true).hashPrefix('!');

	$routeProvider
	.when('/', {
		template: '<front-page></front-page>'
	})
	.when('/animation/:animId', {
		template: '<front-page></front-page>'
	});
}]);