angular.module('trendie.controllers', [])

.controller('AppCtrl', function($scope, $window, $location, Auth, $ionicHistory, $ionicPopup) {
	
	$scope.imagesUrl = 'http://www.papayainteriordesign.com/sites/gotrendyapp/fotos/';

	$scope.appAncho = $window.innerWidth;


	$scope.logout = function(){
		var confirmPopup = $ionicPopup.confirm({
			title: 'Salir',
			template: '¿Está seguro que desea salir?',
			okType: 'button-royal'
		});
		confirmPopup.then(function(res) {
			if(res) {
				Auth.clearCredentials();
				$ionicHistory.nextViewOptions({
					disableAnimate: true,
					disableBack: true
				});
				$location.path('/login');
			}
		});


	}

})

.controller('LoginCtrl', function($scope, LoginService, $ionicLoading, $location, $timeout, Auth, $ionicPopup, $ionicHistory, $timeout){

	$scope.login = {};

	$scope.util = {loading: false, boton: 'Entrar', logged:false};

	$scope.doLogin = function(){
		// $ionicLoading.show();
		$scope.util = {loading: true, boton: ''};

		LoginService.save($scope.login).$promise
		.then(function(data){
			$scope.util.logged = true;
				$timeout(function(){
					Auth.saveCredentials({
						id: data.idusuario,
						token: data.token,
						nombre: data.nombre,
						email: $scope.login.email
					});
					$ionicHistory.nextViewOptions({
						disableAnimate: true,
						disableBack: true
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
	}
})
.controller('RegisterCtrl', function($scope, RegistroService, $ionicLoading, $location, Auth, $ionicPopup, $ionicHistory){
	$scope.login = {};

	$scope.util = {loading: false, boton: 'Registrarse'};

	$scope.doReg = function(){

		$scope.util = {loading: true, boton: ''};

		RegistroService.save($scope.login).$promise
		.then(
			function(data){
				$scope.util.logged = true;
				$timeout(function(){
					Auth.saveCredentials({
						nombre:$scope.login.nombre,
						email: $scope.login.email,
						token: data.token,
						id: data.idusuario
					});

					$ionicHistory.nextViewOptions({
						disableAnimate: true,
						disableBack: true
					});
					$location.path('/app/home');
					$scope.util = {loading: false, boton: 'Registrarse'};
				}, 500)

			},function(err){
				console.log(err);
				$ionicPopup.alert({
					title: 'Error',
					template: 'Ya existe un usuario con ese email',
					okType: 'button-royal'
				});
			}
		);	
	}
})
.controller('ForgotCtrl', function($scope, ForgotService, $ionicPopup, $location){

	$scope.login = {}

	$scope.util = {loading:false, boton: 'Enviar'};

	$scope.forgot = function(){

		$scope.util = {loading:true, boton: ''};

		ForgotService.save({email: $scope.login.email}).$promise
		.then(function(){
			$scope.util = {loading:false, boton: 'Enviar'};
			$ionicPopup.alert({
				title: 'Exito',
				template: 'La contraseña ha sido enviada a tu email',
				okType: 'button-royal'
			}).then(function(){
				$location.path('/login');

			});
		}, function(err){
			$scope.util = {loading:false, boton: 'Enviar'};
			$ionicPopup.alert({
				title: 'Error',
				template: 'No hay usuario registrado con ese email',
				okType: 'button-royal'
			});
		});		
	}
})

.controller('HomeCtrl', function($scope, CategoriasInicioService){

	$scope.categorias = [];

	$scope.loading = true;

	$scope.page = 1;

	CategoriasInicioService.query({pagina:$scope.page, limite:10}).$promise
	.then(function(categorias){
		$scope.categorias = $scope.categorias.concat(categorias);
		$scope.loading = false;
		$scope.page++;
	}, function(err){
		console.log(err);
		$scope.loading = false;
	})

	$scope.moreDataCanBeLoaded = true;
	$scope.loadMore = function(){
		CategoriasInicioService.query({pagina:$scope.page, limite:10}).$promise
		.then(function(categorias){
			if (categorias.length == 0) $scope.moreDataCanBeLoaded = false;
			$scope.categorias = $scope.categorias.concat(categorias);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.page++;
		}, function(err){
			$scope.$broadcast('scroll.infiniteScrollComplete');
			console.log(err);
		});
	}

})
.controller('DisenadoresCtrl', function($scope, DisenadoresService, $timeout){
	$scope.page = 1;
	$scope.disenadores = [];
	$scope.loading = true;

	DisenadoresService.query({pagina:$scope.page, limite:10}).$promise
	.then(function(disenadores){
		$scope.disenadores = $scope.disenadores.concat(disenadores);
		$scope.page++;
		$scope.loading = false;
	}, function(err){
		console.log(err);
	});

	$scope.moreDataCanBeLoaded = true;
	$scope.loadMore = function(){
		DisenadoresService.query({pagina:$scope.page, limite:10}).$promise
		.then(function(disenadores){
			// console.log(productos.length);
			if (disenadores.length == 0) $scope.moreDataCanBeLoaded = false;
			$scope.disenadores = $scope.disenadores.concat(disenadores);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.page++;
		}, function(err){
			$scope.$broadcast('scroll.infiniteScrollComplete');
			console.log(err);
		});
	}
})
.controller('DisenadorCtrl', function($scope, $ionicScrollDelegate, $stateParams, DisenadorSingleService, ProductosDisenadoresService){
	$scope.page = 1;
	$scope.loading = true;
	$scope.disenador = {};
	$scope.productos = [];

	DisenadorSingleService.get({iddisenador: $stateParams.id}).$promise
	.then(function(disenador){
		$scope.disenador = disenador;
		$scope.loading = false;

		ProductosDisenadoresService.query({iddisenador:$stateParams.id, pagina:$scope.page, limite:10}).$promise
		.then(function(productos){
			$scope.productos = $scope.productos.concat(productos);
			$ionicScrollDelegate.resize();
			$scope.page++;
		});
	}, function(err){
		console.log(err);
	});

	$scope.moreDataCanBeLoaded = true;
	$scope.loadMore = function(){
		ProductosDisenadoresService.query({iddisenador:$stateParams.id, pagina:$scope.page, limite:10}).$promise
		.then(function(productos){
			if (productos.length == 0) $scope.moreDataCanBeLoaded = false;
			$scope.productos = $scope.productos.concat(productos);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.page++;
		}, function(err){
			$scope.$broadcast('scroll.infiniteScrollComplete');
			console.log(err);
		});
	}

})
.controller('CategoriaCtrl', function($scope, $ionicScrollDelegate,  ProductosCategoriaService, CategoriaService, $stateParams){
	$scope.categoria = {};
	$scope.productos = [];
	$scope.loading = true;
	$scope.loadingprod = true;

	$scope.page = 1;

	CategoriaService.get({idcategoria:$stateParams.id}).$promise
	.then(function(categoria){
		$scope.loading = false;
		$scope.categoria = categoria;
		ProductosCategoriaService.query({idcategoria:$stateParams.id, pagina:$scope.page, limite:10}).$promise
		.then(function(productos){
			$scope.loadingprod = false;
			$scope.productos = $scope.productos.concat(productos);
			$ionicScrollDelegate.resize();
			$scope.page++;
		})
	}, function(err){
		$scope.loading = false;
		$scope.loadingprod = false;
		console.log(err);
	})

	$scope.moreDataCanBeLoaded = true;
	$scope.loadMore = function(){
		ProductosCategoriaService.query({idcategoria:$stateParams.id, pagina:$scope.page, limite:10}).$promise
		.then(function(productos){
			if (productos.length == 0) $scope.moreDataCanBeLoaded = false;
			$scope.productos = $scope.productos.concat(productos);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.page++;
		}, function(err){
			$scope.$broadcast('scroll.infiniteScrollComplete');
			console.log(err);
		});
	};

})
.controller('SingleCtrl', 
	function($scope, $ionicScrollDelegate, SingleService, $stateParams, $ionicSlideBoxDelegate, 
		ProductosRelacionadosService, $timeout, desfavoritearService, favoritearService){

	$scope.producto = {};

	$scope.loading = true;

	$scope.cantidad = [];

	$scope.carouselIndex = 0;

	$scope.relacionados = [];

	$scope.page = 1;

	// $scope.idid = $stateParams.id;

	SingleService.get({
		idproducto: $stateParams.id
	}).$promise.then(function(producto){
		$scope.producto = producto;
		$scope.producto.cantidad = '';
		$scope.loading = false;
		$ionicSlideBoxDelegate.update();
		// $scope.tallaSelected = '0';
		ProductosRelacionadosService.query({
			idcategoria:producto.idcategoria, 
			idproducto: $stateParams.id, 
			pagina:$scope.page, 
			iddisenador: $scope.producto.iddisenador,
			limite:10 }
		).$promise
		.then(function(relacionados){
			$scope.relacionados = relacionados;
			$scope.page++;
			$ionicScrollDelegate.resize();
		});
	}, function(err){
		$scope.loading = false;
		console.log(err);
	})

	$scope.moreDataCanBeLoaded = true;
	$scope.loadMore = function(){
		ProductosRelacionadosService.query({
			idcategoria:$scope.producto.idcategoria, 
			idproducto: $stateParams.id, 
			pagina:$scope.page, 
			iddisenador: $scope.producto.iddisenador,
			limite:10 }
		).$promise
		.then(function(relacionados){
			if (relacionados.length < 1) $scope.moreDataCanBeLoaded = false;
			$scope.relacionados = $scope.relacionados.concat(relacionados);
			$scope.page++;
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}, function(err){
			console.log(err);
			$scope.$broadcast('scroll.infiniteScrollComplete');
		})
	}

	$scope.tallaChanged = function(talla){
		if ($scope.producto.tallas[talla].existencia > 0) {
			$scope.cantidad = [];
			for (i = 1; i <= $scope.producto.tallas[talla].existencia; i++) { 
				$scope.cantidad.push(i.toString());
			}
		} else {
			$scope.cantidad = ['0'];
		}
		$timeout(function(){
			$scope.producto.cantidad = $scope.cantidad[0];
			console.log($scope.producto.cantidad);	
		},0);
	}

	var enviar;
	$scope.favorite = function(fav){

		if (fav.favoriteado == 0) {
			fav.favoriteado = 1;
		} else {
			fav.favoriteado = 0;
		};
		$timeout.cancel(enviar);

		enviar = $timeout(function(){
			if (fav.favoriteado == 0 ){
				desfavoritearService.save({idproducto:parseInt($stateParams.id)}).$promise
				.then({}, function(err){
					fav.favoriteado = 1
				});
			} else {
				favoritearService.save({idproducto:parseInt($stateParams.id)}).$promise
				.then({}, function(err){
					fav.favoriteado = 0
				});
			}
		}, 1000)
	}
})
.controller('WishlistCtrl', function($scope, WishlistService, desfavoritearService, $timeout){
	$scope.loading = true;
	$scope.page = 1;

	$scope.wishlist = [];

	WishlistService.query({pagina:$scope.page, limite:10}).$promise
	.then(function(wishlist){
		$scope.loading = false;
		$timeout(function(){
			$scope.wishlist = $scope.wishlist.concat(wishlist);	
		},1);
		$scope.page++;
	}, function(err){
		console.log(err);
	})

	$scope.remove = function($index) {
		desfavoritearService.save({idproducto: parseInt($scope.wishlist[$index].idproducto)});
		$scope.wishlist.splice($index,1);
	}

	$scope.moreDataCanBeLoaded = true;
	$scope.loadMore = function(){
		WishlistService.query({pagina:$scope.page, limite:10}).$promise
		.then(function(wishlist){
			if (wishlist.length == 0) $scope.moreDataCanBeLoaded = false;
			$scope.wishlist = $scope.wishlist.concat(wishlist);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.page++;
		}, function(err){
			$scope.$broadcast('scroll.infiniteScrollComplete');
			console.log(err);
		});
	};	
})
.controller('BloCtrl', function($scope){

})