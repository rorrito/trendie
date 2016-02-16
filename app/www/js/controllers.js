angular.module('trendie.controllers', [])

.controller('AppCtrl', function($scope) {
})

.controller('LoginCtrl', function($scope, UserService, $ionicLoading, $location, $timeout){

	$scope.login = {};

	$scope.util = {loading: false, boton: 'Entrar'};

	$scope.doLogin = function(){
		// $ionicLoading.show();
		$scope.util = {loading: true, boton: ''};

		$timeout(function(){
			$scope.util.logged = true;
			$timeout(function(){
				$location.path('/app/home');
			}, 500);
		}, 2000)

		// UserService.logIn($scope.login)
		// .then(
		// 	function(data){
		// 		$location('/app/home');
		// 	}, function(err){
		// 		console.log(err);
		// 	}
		// );
	}
})

.controller('RegisterCtrl', function($scope, UserService, $ionicLoading, $location){
	$scope.login = {};

	$scope.util = {loading: false, boton: 'Registrarse'};

	$scope.doReg = function(){
		UserService.signUp($scope.login)
		.then(
			function(data){
				$location('/app/home');
			},function(err){
				console.log(err);
			}
		);	
	}
})

.controller('HomeCtrl', function($scope){

})
.controller('SingleCtrl', function($scope){

	$scope.fav = false;

	$scope.favorite = function(){
		$scope.fav = !$scope.fav;
	}
})