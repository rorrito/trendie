var dev = false;

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
		ProductosRelacionadosService, $timeout, desfavoritearService, favoritearService, agregarProductoService, 
		nProductosEnCarritoService, $cordovaToast, $cordovaSocialSharing){

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

		if (!dev) $cordovaToast.show('Artículo agregado', 'long', 'bottom');
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

	$scope.SShare = function(producto){
		var message = null;
		var subject = null;
		var file = null;
		var link = 'http://productoid.com/'+$stateParams.id;


		$cordovaSocialSharing
			.share(message, subject, file, link) // Share via native share sheet
			.then(function(result) {
				if (!dev) $cordovaToast.show('Articulo Compartido', 'long', 'bottom');
			}, function(err) {
				if (!dev) $cordovaToast.show('Ha Ocurrido un error', 'long', 'bottom');
		});
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
.controller('CarritoCtrl', function($rootScope, $cordovaToast, $scope, productosEnCarritoService, agregarProductoService, nProductosEnCarritoService){
	$scope.loading = true;
	$scope.carrito = [];
	$scope.cantidad = {};

	productosEnCarritoService.get().$promise.then(
		function(carrito){
			$scope.carrito = carrito.productos || [];
			$scope.cantidad = parseInt(carrito.cantidad);
			$scope.loading = false;
		}, function(err){
			console.log(err);
		});

	$scope.addItem = function(producto){

		producto.cantidad = +producto.cantidad+1;

		if (!dev) $cordovaToast.show('Artículo agregado', 'long', 'bottom');

		agregarProductoService.save({
			idtalla: producto.idtalla,
			cantidad: producto.cantidad
		}).$promise.then(function(){
			nProductosEnCarritoService.get().$promise.then(
				function(n){
					$rootScope.productosCarrito = n.cantidad;
					if (n.cantidad == 0) {
						productosEnCarritoService.get().$promise.then(
							function(carrito){
								$scope.carrito = carrito.productos || [];
								$scope.cantidad = parseInt(carrito.cantidad);
							}, function(err){
								console.log(err);
							});
					}					
				});
		}, function(err){
			producto.cantidad = +producto.cantidad-1;
			if (!dev) $cordovaToast.show('Ha Ocurrido un error', 'long', 'bottom');
			console.log(err);
		});

	}

	$scope.removeItem = function(producto){

		producto.cantidad = +producto.cantidad-1
		if (!dev) $cordovaToast.show('Artículo Eliminado', 'long', 'bottom');

		agregarProductoService.save({
			idtalla: producto.idtalla,
			cantidad: producto.cantidad
		}).$promise.then(function(){
			nProductosEnCarritoService.get().$promise.then(
				function(n){
					$rootScope.productosCarrito = n.cantidad;
					if (n.cantidad == 0) {
						productosEnCarritoService.get().$promise.then(
							function(carrito){
								$scope.carrito = carrito.productos || [];
								$scope.cantidad = parseInt(carrito.cantidad);
							}, function(err){
								console.log(err);
							});
					}
				});	
		}, function(err){
			producto.cantidad = +producto.cantidad+1;
			if (!dev) $cordovaToast.show('Ha Ocurrido un error', 'long', 'bottom');
			console.log(err);
		})
	}

	$scope.removeItemFull = function(producto){

		producto.cantidad = 0;
		if (!dev) $cordovaToast.show('Artículo Eliminado', 'long', 'bottom');

		agregarProductoService.save({
			idtalla: producto.idtalla,
			cantidad: producto.cantidad
		}).$promise.then(function(){
			nProductosEnCarritoService.get().$promise.then(
				function(n){
					$rootScope.productosCarrito = n.cantidad;
				if (n.cantidad == 0) {
					productosEnCarritoService.get().$promise.then(
						function(carrito){
							$scope.carrito = carrito.productos || [];
							$scope.cantidad = parseInt(carrito.cantidad);
						}, function(err){
							console.log(err);
						});
				}				
				});	
		}, function(err){
			producto.cantidad = +producto.cantidad;
			if (!dev) $cordovaToast.show('Ha Ocurrido un error', 'long', 'bottom');
			console.log(err);
		})
	}	

})
.controller('DireccionesCtrl', function($scope, $ionicScrollDelegate, $timeout, estadosService, $location,
	ciudadesService, urbanizacionesService, guardaDireccionesService, direccionActualService, $ionicLoading){

	$ionicLoading.show();

	$scope.util = {diferentes : false};
	$scope.shipping = {};
	$scope.billing = {};
	$scope.form = {};

	estadosService.query().$promise.then(function(estados){
		$scope.form.estados = estados;

		direccionActualService.get().$promise.then(function(billing){

			$ionicLoading.hide();

			$timeout(function(){
				$scope.shipping = billing;
				billing.BillingidCI = parseInt(billing.BillingidCI);
				$scope.billing = billing;

				if ($scope.shipping.ShipToAddress !== $scope.billing.BillingAddress) {
					// $timeout(function(){
						$scope.util.diferentes = true;

						$scope.BillingidestadoChange(function(){
						})
						$scope.$apply(function(){
							$scope.BillingidestadoChange();	
						});
						
						$scope.BillingidciudadChange(function(){

						});
						$scope.$apply(function(){
							$scope.BillingidciudadChange();	
						});
						$scope.ShipToidestadoChange(function(){
						})
						$scope.$apply(function(){
							$scope.ShipToidestadoChange();	
						});
						
						$scope.ShipToidciudadChange(function(){

						});
						$scope.$apply(function(){
							$scope.ShipToidciudadChange();	
						});						
					// },20)
				} else {
						$scope.BillingidestadoChange(function(){
							// console.log('hey');
						})
						$scope.$apply(function(){
							$scope.BillingidestadoChange();	
						});
						
						$scope.BillingidciudadChange(function(){

						});
						$scope.$apply(function(){
							$scope.BillingidciudadChange();	
						});
				}
			},20)
				

		});

	})	

	$scope.igualChange = function(){
		$timeout(function(){
			$ionicScrollDelegate.resize();
		},100);
	}

	$scope.BillingidestadoChange = function(cb){
		ciudadesService.query({idestado:$scope.billing.Billingidestado}).$promise.then(function(ciudades){
			$scope.form.billingCiudades = ciudades;
			if (cb) cb();
		})
	}

	$scope.BillingidciudadChange = function(cb){
		urbanizacionesService.query({idciudad:$scope.billing.Billingidciudad}).$promise.then(function(urbanizaciones){
			$scope.form.billingUrbanizaciones = urbanizaciones;
			if (cb) cb();
		})
	}
	$scope.ShipToidestadoChange = function(cb){
		ciudadesService.query({idestado:$scope.shipping.ShipToidestado}).$promise.then(function(ciudades){
			$scope.form.shippingCiudades = ciudades;
			if (cb) cb();
		})
	}

	$scope.ShipToidciudadChange = function(cb){
		urbanizacionesService.query({idciudad:$scope.shipping.ShipToidciudad}).$promise.then(function(urbanizaciones){
			$scope.form.shippingUrbanizaciones = urbanizaciones;
			if (cb) cb();
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
.controller('CheckoutCtrl', function($rootScope, $scope, $ionicHistory, guardaDireccionesService, $ionicLoading, checkoutService, $location, nProductosEnCarritoService){
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

	$scope.pagarTransferencia = function(){
		$ionicLoading.show();
		checkoutService.save({tipo:'dt'}).$promise.then(function(){
			$ionicLoading.hide();
			nProductosEnCarritoService.get().$promise.then(
				function(n){
				$rootScope.productosCarrito = n.cantidad;
			})

			$ionicHistory.nextViewOptions({
				disableAnimate: true,
				disableBack: true
			});			
			$location.path('/app/pagar-transferencia');
		}, function(err){
			$ionicLoading.hide();
			console.log(err);
		});
	}

})
.controller('TransferenciaCtrl', function($scope, $rootScope, bancosService){
	$scope.bancos = [];
	$scope.loading = true;
	bancosService.query().$promise.then(
		function(bancos){
			$scope.bancos = bancos;
			$scope.loading = false;
		}, function(err){
			console.log(err);
			$scope.loading = false;
		})

})
.controller('MisOrdenesCtrl', function($scope, misOrdenesService){
	$scope.ordenes = [];
	$scope.loading = true;
	misOrdenesService.query().$promise.then(
		function(ordenes){
			$scope.loading = false;
			$scope.ordenes = ordenes;
		},
		function(err){
			$scope.loading = false;
			console.log(err);
		})
})
.controller('OrderSingleCtrl', function($scope, ordenSingleService, $stateParams){
	$scope.orden = [];
	$scope.loading = true;

	ordenSingleService.get({idorden: $stateParams.id}).$promise.then(
		function(orden){
			$scope.orden = orden;
			$scope.orden.idorden = $stateParams.id;
			$scope.loading = false;
		}, function(err){
			console.log(err);
			$scope.loading = false;
		})

})
.controller('PagoTransferenciaCtrl', function($scope, $ionicHistory, $location, montoOrdenService, $stateParams, bancosService, registrarpagoService, $ionicLoading, $ionicPopup){
	$scope.loading = true;
	$scope.monto = {};
	$scope.bancos = [];
	$scope.trans = {}

	bancosService.query().$promise.then(
		function(bancos){
			$scope.bancos = bancos;
			$scope.loading = false;
			$scope.trans.banco = $scope.bancos[0].idbanco;
		}, function(err){
			console.log(err);
			$scope.loading = false;
		});

	montoOrdenService.get({idorden: $stateParams.id}).$promise.then(function(monto){
		$scope.monto = monto.monto;
	});

	$scope.registrarPago = function(){
		$ionicLoading.show();
		registrarpagoService.save({
			idorden: $stateParams.id,
			idbanco: $scope.trans.banco,
			confirmacion: $scope.trans.referencia
		}).$promise.then(function(){
			$ionicLoading.hide();
			$ionicPopup.alert({
				title: 'Exito',
				template: 'Su pago ha sido registrado exitosamente, pronto será contactado',
				okType: 'button-royal'
			}).then(function(){
				$ionicHistory.nextViewOptions({
					disableAnimate: true,
					disableBack: true
				});
				$location.path('/app/home');
			});

		}, function(err){
			$ionicLoading.hide();

		});
	}
})
.controller('PagoTarjetaCtrl', function($scope, guardaDireccionesService, checkoutService, $ionicLoading, $rootScope, nProductosEnCarritoService, $location){
	// $scope.loading = true;

	$scope.ccard = {};
	$scope.util = {};

	$scope.respuesta = false;
	$scope.voucher = '';

	guardaDireccionesService.get().$promise.then(
		function(orden){
			$scope.orden = orden;
			$scope.loading = false;
		}, function(err){
			console.log(err);
			$scope.loading = false;
		});

	$scope.cambiarFecha = function(){
		var fecha = new Date($scope.util.mes);
		console.log(fecha.getFullYear())
		$scope.ccard.ExpMonth = fecha.getMonth()+1;
		$scope.ccard.ExpYear = fecha.getFullYear();
	}

	$scope.cardPay = function(){
		$ionicLoading.show();

		$scope.ccard.tipo = 'tc';

		checkoutService.save($scope.ccard).$promise.then(function(card_res){
			$ionicLoading.hide();

			if(card_res.respuesta === 'Aprobada' ) {
				$scope.respuesta = 'Transacción Aprobada';
				$scope.voucher = card_res.voucher;
				nProductosEnCarritoService.get().$promise.then(
					function(n){
					$rootScope.productosCarrito = n.cantidad;
				})
			} else {
				$scope.respuesta = 'Transacción Rechazada';
				$scope.voucher = card_res.voucher;
			}
		}, function(err){
			$ionicLoading.hide();
			console.log(err);
		});

	}

})
.controller('BloCtrl', function($scope){

})