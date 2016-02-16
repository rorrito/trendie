angular.module('trendie.controllers', [])

.controller('AppCtrl', function($scope) {
	$scope.imagesUrl = 'http://www.papayainteriordesign.com/sites/gotrendyapp/fotos/'
})

.controller('LoginCtrl', function($scope, LoginService, $ionicLoading, $location, $timeout, Auth, $ionicPopup){

	$scope.login = {};

	$scope.util = {loading: false, boton: 'Entrar'};

	$scope.doLogin = function(){
		// $ionicLoading.show();
		$scope.util = {loading: true, boton: ''};

		LoginService.save($scope.login).$promise
		.then(function(data){
			$scope.util.logged = true;
				$timeout(function(){
					Auth.saveCredentials({
						token: data.token,
						nombre: data.nombre,
						email: $scope.login.email
					});
					$location.path('/app/home');
				}, 500);
		}, function(err){
			$scope.util = {loading: false, boton: 'Entrar'};
				$ionicPopup.alert({
					title: 'Error',
					template: 'Email o contraseña invalidos',
					okType: 'button-royal'
				});
		})

		// $timeout(function(){

		// }, 2000)

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

.controller('RegisterCtrl', function($scope, RegistroService, $ionicLoading, $location, Auth, $ionicPopup){
	$scope.login = {};

	$scope.util = {loading: false, boton: 'Registrarse'};

	$scope.doReg = function(){
		RegistroService.save($scope.login).$promise
		.then(
			function(data){
				console.log(data);
				Auth.saveCredentials({
					nombre:$scope.login.nombre,
					email: $scope.login.email,
					token: data.token
				});
				$location.path('/app/home');
			},function(err){
				// console.log(err);
				$ionicPopup.alert({
					title: 'Error',
					template: 'Ya existe un usuario con ese email',
					okType: 'button-royal'
				});
			}
		);	
	}
})

.controller('HomeCtrl', function($scope, CategoriasInicioService){

	$scope.categorias = {};

	$scope.loading = true;

	CategoriasInicioService.query().$promise
	.then(function(categorias){
		$scope.categorias = categorias;
		$scope.loading = false;
	}, function(err){
		console.log(err);
		$scope.loading = false;
	})

})
.controller('SingleCtrl', function($scope, SingleService, $stateParams){

	$scope.producto = {};

	SingleService.get({
		idproducto: $stateParams.id
	}).$promise.then(function(producto){
		$scope.producto = producto;
	}, function(err){
		console.log(err);
	})

	$scope.fav = false;

	$scope.favorite = function(){
		$scope.fav = !$scope.fav;
	}
})