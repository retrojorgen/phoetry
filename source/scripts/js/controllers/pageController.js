angular.module('Phoetry').component('frontPage', {
	templateUrl: '/assets/scripts/views/frontPage.html',
	controller: 'pageController as pa'
});


angular.module('Phoetry').controller('pageController', 
	['$scope', '$http', '$routeParams', '$window', '$location', 
	function ($scope, $http, $routeParams, $window, $location) {
	var pa = this;
	pa.hest = 'hesten min';

	if($routeParams.animId) {
		console.log($routeParams.animId);
	}
	pa.urlRoot = $window.location.origin;
	pa.currentUrl = $window.location.href;
	pa.input = {
		newSearchPhrase: '',
		loading: false
	};

	pa.latestVideos = [];
	pa.selectedVideo = undefined;

	pa.makePhoetry = function () {
		pa.input.loading = true;
		$http.post('/api/post/animation', {
			phrase: pa.input.newSearchPhrase
		})
		.then(function (response) {
			pa.input.loading = false;
			$location.path("/animation/" + response.data._id);
		})
	}

	if($routeParams.animId) {
		$http.get('/api/get/animation/' + $routeParams.animId)
			.then(function (response) {
				console.log('horse donkey', response);
				pa.selectedVideo = response.data;
			});
	}

	$http.get('/api/get/animations')
		.then(function (response) {
			
			pa.latestVideos = response.data;
		});
}]);