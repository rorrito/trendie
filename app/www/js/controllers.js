angular.module('trendie.controllers', [])

.controller('AppCtrl', function($scope, $window) {
	
	$scope.imagesUrl = 'http://www.papayainteriordesign.com/sites/gotrendyapp/fotos/';

	$scope.appAncho = $window.innerWidth;

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
.controller('CategoriaCtrl', function($scope, ProductosCategoriaService, CategoriaService, $stateParams){
	$scope.categoria = {};
	$scope.productos = {};
	$scope.loading = true;

	CategoriaService.get({idcategoria:$stateParams.id}).$promise
	.then(function(categoria){
		$scope.loading = false;
		$scope.categoria = categoria;
		ProductosCategoriaService.query({idcategoria:$stateParams.id}).$promise
		.then(function(productos){
			$scope.productos = $productos;
		})
	}, function(err){
		$scope.loading = false;
		console.log(err);
	})

})
.controller('SingleCtrl', function($scope, SingleService, $stateParams, $ionicSlideBoxDelegate, ProductosCategoriaService){

	$scope.producto = {};

	$scope.loading = true;

	$scope.cantidad = [];

	$scope.relacionados = {};

	SingleService.get({
		idproducto: $stateParams.id
	}).$promise.then(function(producto){
		$scope.producto = producto;
		$scope.loading = false;
		$ionicSlideBoxDelegate.update();
		$scope.tallaSelected = 0;
		ProductosCategoriaService.query({idcategoria:2 }).$promise
		.then(function(relacionados){
			$scope.relacionados = relacionados;
		})
	}, function(err){
		$scope.loading = false;
		console.log(err);
	})

	$scope.fav = false;

	$scope.tallaChanged = function(talla){
		if ($scope.producto.tallas[talla].existencia > 0) {
			$scope.cantidad = [];
			for (i = 1; i <= $scope.producto.tallas[talla].existencia; i++) { 
				$scope.cantidad.push(i);
			}
		} else {
			$scope.cantidad = ['Agotado'];
		}
		
	}

	$scope.favorite = function(){
		$scope.fav = !$scope.fav;
	}
})