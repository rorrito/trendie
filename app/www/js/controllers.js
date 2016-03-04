angular.module('trendie.controllers', [])

.controller('AppCtrl', function($scope, $window, $location, Auth, $ionicHistory, $ionicPopup, 
	$rootScope, nProductosEnCarritoService, productosEnCarritoService) {
	
	$scope.imagesUrl = 'http://www.papayainteriordesign.com/sites/gotrendyapp/fotos/';

	$scope.appAncho = $window.innerWidth;


	if ($rootScope.globals.currentUser) {
		nProductosEnCarritoService.get().$promise.then(
			function(n){
			$rootScope.productosCarrito = n.cantidad;
		})
	}

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

	$scope.irAlCarrito = function(){
		productosEnCarritoService.get().$promise.then(function(res){
			console.log(res);
		})
	}

})

.controller('LoginCtrl', function($scope, LoginService, $ionicLoading, $location, $timeout, Auth, $ionicPopup, $ionicHistory, $timeout, $rootScope){

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
					// productosEnCarritoService.get().$promise.then(
					// 	function(n){
					// 		$rootScope.productosCarrito = n.cantidad;
					// });
				}, 500);
		}, function(err){
			$scope.util = {loading: false, boton: 'Entrar', logged:false};
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
	function($scope, $ionicScrollDelegate, SingleService, $stateParams, $ionicSlideBoxDelegate, $rootScope,
		ProductosRelacionadosService, $timeout, desfavoritearService, favoritearService, agregarProductoService, nProductosEnCarritoService){

	$scope.producto = {};
	$scope.tallaSelected = '';
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
		$scope.tallaSelected = talla;
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

	$scope.enviarAlCarrito = function(){
		agregarProductoService.save({
			idtalla: $scope.producto.tallas[$scope.tallaSelected].idtalla,
			cantidad: $scope.producto.cantidad
		}).$promise.then(function(){
			nProductosEnCarritoService.get().$promise.then(
				function(n){
					$rootScope.productosCarrito = n.cantidad;
				})
		}, function(err){
			console.log(err);
		})
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
.controller('CarritoCtrl', function($rootScope, $scope, productosEnCarritoService, agregarProductoService, nProductosEnCarritoService){
	$scope.loading = true;
	$scope.carrito = [];

	productosEnCarritoService.get().$promise.then(
		function(carrito){
			$scope.carrito = carrito.productos;
			$scope.loading = false;
		}, function(err){
			console.log(err);
		})

	$scope.addItem = function(producto){

		producto.cantidad = +producto.cantidad+1;

		agregarProductoService.save({
			idtalla: producto.idtalla,
			cantidad: producto.cantidad
		}).$promise.then(function(){
			nProductosEnCarritoService.get().$promise.then(
				function(n){
					$rootScope.productosCarrito = n.cantidad;
				})
		}, function(err){
			producto.cantidad = +producto.cantidad-1
			console.log(err);
		})

	}

	$scope.removeItem = function(producto){

		producto.cantidad = +producto.cantidad-1

		agregarProductoService.save({
			idtalla: producto.idtalla,
			cantidad: producto.cantidad
		}).$promise.then(function(){
			nProductosEnCarritoService.get().$promise.then(
				function(n){
					$rootScope.productosCarrito = n.cantidad;
				})
		}, function(err){
			producto.cantidad = +producto.cantidad+1
			console.log(err);
		})
	}

})
.controller('DireccionesCtrl', function($scope, $ionicScrollDelegate, $timeout, estadosService, $location,
	ciudadesService, urbanizacionesService, guardaDireccionesService, direccionActualService, $ionicLoading){

	$scope.util = {diferentes : false};
	$scope.shipping = {};
	$scope.billing = {};
	$scope.form = {};

	$scope.igualChange = function(){
		$timeout(function(){
			$ionicScrollDelegate.resize();
		},100);
	}

	direccionActualService.get().$promise.then(function(billing){
		$scope.shipping = billing;
		billing.BillingidCI = parseInt(billing.BillingidCI);
		$scope.billing = billing;
		if ($scope.shipping.ShipToAddress !== $scope.billing.BillingAddress) {
			$timeout(function(){
				$scope.util.diferentes = true;
			},10)
		}
	});



	estadosService.query().$promise.then(function(estados){
		$scope.form.estados = estados;
	})

	$scope.BillingidestadoChange = function(){
		ciudadesService.query({idestado:$scope.billing.Billingidestado}).$promise.then(function(ciudades){
			$scope.form.billingCiudades = ciudades;
		})
	}

	$scope.BillingidciudadChange = function(){
		urbanizacionesService.query({idciudad:$scope.billing.Billingidciudad}).$promise.then(function(urbanizaciones){
			$scope.form.billingUrbanizaciones = urbanizaciones;
		})
	}
	$scope.ShipToidestadoChange = function(){
		ciudadesService.query({idestado:$scope.shipping.ShipToidestado}).$promise.then(function(ciudades){
			$scope.form.shippingCiudades = ciudades;
		})
	}

	$scope.ShipToidciudadChange = function(){
		urbanizacionesService.query({idciudad:$scope.shipping.ShipToidciudad}).$promise.then(function(urbanizaciones){
			$scope.form.shippingUrbanizaciones = urbanizaciones;
		})
	}	




	$scope.sendDirecciones = function(){

		var billing = $scope.billing;

		var direcciones = {
			BillingName: billing.BillingName,
			BillingidCI: billing.BillingidCI,
			Billingidestado: billing.Billingidestado,
			Billingidciudad: billing.Billingidciudad,
			Billingidurbanizacion: billing.Billingidurbanizacion,
			BillingAddress: billing.BillingAddress,
			BillingPhone: billing.BillingPhone
		}

		if ($scope.util.diferentes) {
			var shipping = $scope.shipping;
			direcciones.ShipToName = shipping.ShipToName;
			direcciones.ShipToidestado = shipping.ShipToidestado;
			direcciones.ShipToidciudad = shipping.ShipToidciudad;
			direcciones.ShipToidurbanizacion = shipping.ShipToidurbanizacion;
			direcciones.ShipToAddress= shipping.ShipToAddress;
			direcciones.ShipToPhone= shipping.ShipToPhone;
		} else {
			// var shipping = $scope.billing;
			direcciones.ShipToName = billing.BillingName;
			direcciones.ShipToidestado = billing.Billingidestado;
			direcciones.ShipToidciudad = billing.Billingidciudad;
			direcciones.ShipToidurbanizacion = billing.Billingidurbanizacion;
			direcciones.ShipToAddress = billing.BillingAddress;
			direcciones.ShipToPhone = billing.BillingPhone;
		}

		$ionicLoading.show();
		guardaDireccionesService.save(direcciones).$promise.then(function(){
			$ionicLoading.hide();
			$location.path('/app/checkout')
		}, function(err){
			$ionicLoading.hide();
			console.log(err);
		})

	}
})
.controller('CheckoutCtrl', function($scope, guardaDireccionesService){
	$scope.orden = {}
	$scope.loading = true;

	guardaDireccionesService.get().$promise.then(
		function(orden){
			$scope.orden = orden;
			$scope.loading = false;
		}, function(err){
			console.log(err);
			$scope.loading = false;
		})

})
.controller('BloCtrl', function($scope){

})