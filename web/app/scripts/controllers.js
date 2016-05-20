/* globals angular:false, menuCategory, afterLoad, hacerSlideHome, FB */
'use strict';

angular.module('trendy.controllers', [])

.filter('unsafe', ['$sce', function($sce) { return $sce.trustAsHtml; }])

.controller('AppCtrl', ['$scope', 'ngDialog', 'Auth', '$location',
	function($scope, ngDialog, Auth, $location){

	$scope.imagesUrl = 'http://gotrendyapp.com/fotos/';

	$scope.loginLb = function(){
		ngDialog.open({ template: 'views/loginTemplate.html', className: 'ngdialog-theme-default' });
	};

	$scope.logOut = function(){
		Auth.clearCredentials();
		$location.path('/');
	};

}])

.controller('LoginCtrl', ['$scope', 'LoginService', 'Auth', 'nProductosEnCarritoService', '$rootScope', 'ngDialog',
	function($scope, LoginService, Auth, nProductosEnCarritoService, $rootScope, ngDialog){

	$scope.user = {};

	$scope.util = {loading: false, boton: 'Entrar', message: false};

	$scope.doLogin = function(){

		$scope.util = {loading: true, boton: 'Entrando...', message: false};

		LoginService.save($scope.user).$promise
		.then(function(data){
					Auth.saveCredentials({
						id: data.idusuario,
						token: data.token,
						nombre: data.nombre,
						email: $scope.user.email
					});
					nProductosEnCarritoService.get().$promise.then(
						function(n){
							$rootScope.productosCarrito = n.cantidad;

						$scope.util = {loading: false, boton: 'Entrar', message: false};
						ngDialog.close();
					});
		}, function(err){
			console.log(err);
			$scope.util = {loading: false, boton: 'Entrar', message: 'Email o contraseña invalidos'};
		});
	};
}])

.controller('SignupCtrl', ['$scope', 'RegistroService', 'Auth', 'ngDialog',
	function($scope, RegistroService, Auth, ngDialog){
	$scope.user = {};

	$scope.util = {loading: false, boton: 'Registrarse', message: false};

	$scope.doSignup = function(){

		$scope.util = {loading: true, boton: 'Registrando...', message: false};

		RegistroService.save($scope.user).$promise
		.then(
			function(data){
					Auth.saveCredentials({
						nombre: $scope.user.nombre,
						email: $scope.user.email,
						token: data.token,
						id: data.idusuario
					});
					ngDialog.close();
				$scope.util = {loading: false, boton: 'Registrarse', message: false};
			}, function(err){
				console.log(err);
				$scope.util = {loading: false, boton: 'Registrarse', message: 'Ya existe un usuario con ese email'};
			});
	};


}])

.controller('HomeCtlr', ['$scope', 'CategoriasInicioService', 'sliderService', 'bannerService', '$timeout', '$state',
	function($scope, CategoriasInicioService, sliderService, bannerService, $timeout, $state){


	$scope.categorias = [];
	$scope.slides = [];
	$scope.banners = [];

	$scope.loading = true;

	$scope.page = 1;

	sliderService.query().$promise
	.then(function(slides){
		$scope.slides = slides;
	});

	bannerService.get().$promise
	.then(function(banners){
		$scope.banners = banners;
	});

	CategoriasInicioService.query({pagina: $scope.page, limite: 10}).$promise
	.then(function(categorias){
		$scope.categorias = $scope.categorias.concat(categorias);
		$scope.loading = false;
		$scope.page++;

		$timeout(function(){
			afterLoad();
			hacerSlideHome();
		}, 100);

	}, function(err){
		console.log(err);
		$scope.loading = false;
	});

	$scope.goToSlide = function(slide) {
		$state.go(slide.seccion, {id: slide.parametros});
	};

}])

.controller('CategoriaCtrl', ['$scope', 'CategoriaService', 'ProductosCategoriaService', '$stateParams', 'CategoriasInicioService', '$timeout', 'rangosService', 'tallascategoriaService', 'disenadorescategoriasService',
	function($scope, CategoriaService, ProductosCategoriaService, $stateParams, CategoriasInicioService, $timeout, rangosService, tallascategoriaService, disenadorescategoriasService){

	$scope.categoria = {};
	$scope.categorias = [];
	$scope.productos = [];
	$scope.loading = true;
	$scope.loadingprod = true;
	$scope.rangos = [];
	$scope.tallascat = [];

	$scope.page = 1;
	$scope.filtro = {desde: '', hasta: '', tallacat: '', iddisenador: ''};
	var elQuery = {
				idcategoria: $stateParams.id,
				pagina: $scope.page,
				limite: 8,
				desde: $scope.filtro.desde,
				hasta: $scope.filtro.hasta,
				tallacat: $scope.filtro.tallacat,
				iddisenador: $scope.filtro.iddisenador
			};

	rangosService.query().$promise
	.then(function(rangos){
		$scope.rangos = rangos;
	});

	tallascategoriaService.query({idcategoria: $stateParams.id}).$promise
	.then(function(tallascat){
		$scope.tallascat = tallascat;
	});

	disenadorescategoriasService.query().$promise
	.then(function(disenadorescat){
		$scope.iddisenador = disenadorescat;
	});



	CategoriasInicioService.query({pagina: 1, limite: 100}).$promise
	.then(function(categorias){
		$scope.categorias = categorias;
		$timeout(function(){
			menuCategory();
		}, 100);
		$timeout(function(){
			afterLoad();
		}, 100);
	});




	CategoriaService.get({idcategoria: $stateParams.id}).$promise
	.then(function(categoria){
		$scope.loading = false;
		$scope.categoria = categoria;
		ProductosCategoriaService.query(
			elQuery
		).$promise
		.then(function(productos){
			$scope.loadingprod = false;
			$scope.productos = $scope.productos.concat(productos);
			elQuery.pagina++;

			if (productos.length < 8) {
				$scope.moreDataCanBeLoaded = false;
			} else {
				$scope.moreDataCanBeLoaded = true;
			}
		});
	}, function(err){
		$scope.loading = false;
		$scope.loadingprod = false;
		console.log(err);
	});

	$scope.loadingMore = {loading: false, boton: 'Cargar más'};
	$scope.loadMore = function(){
		$scope.loadingMore = {loading: true, boton: 'Cargando...'};
		ProductosCategoriaService.query(elQuery).$promise
		.then(function(productos){
			$scope.loadingMore = {loading: false, boton: 'Cargar más'};
			if (productos.length < 8) { $scope.moreDataCanBeLoaded = false; }
			$scope.productos = $scope.productos.concat(productos);
			elQuery.pagina++;
		}, function(err){
			console.log(err);
			$scope.loadingMore = {loading: false, boton: 'Cargar más'};
		});
	};

	$scope.precioChange = function(){
		var desdehasta = $scope.filtro.precio.split(',');

		elQuery.desde = desdehasta[0];
		elQuery.hasta = desdehasta[1];
		elQuery.pagina = 1;

		$scope.loadingMore = {loading: true, boton: 'Cargando...'};
		ProductosCategoriaService.query(elQuery).$promise
		.then(function(productos){
			$scope.productos = [];
			$scope.loadingMore = {loading: false, boton: 'Cargar más'};
			if (productos.length < 8) { $scope.moreDataCanBeLoaded = false; }
			$scope.productos = $scope.productos.concat(productos);
			elQuery.pagina++;
		}, function(err){
			console.log(err);
			$scope.loadingMore = {loading: false, boton: 'Cargar más'};
		});
	};

	$scope.tallitaChange = function(){
		console.log('jklhkj');

		elQuery.tallacat = $scope.filtro.talla;
		elQuery.pagina = 1;

		$scope.loadingMore = {loading: true, boton: 'Cargando...'};
		ProductosCategoriaService.query(elQuery).$promise
		.then(function(productos){
			$scope.productos = [];
			$scope.loadingMore = {loading: false, boton: 'Cargar más'};
			if (productos.length < 8) { $scope.moreDataCanBeLoaded = false; }
			$scope.productos = $scope.productos.concat(productos);
			elQuery.pagina++;
		}, function(err){
			console.log(err);
			$scope.loadingMore = {loading: false, boton: 'Cargar más'};
		});
	};

	$scope.disenadorChange = function(){
		elQuery.iddisenador = $scope.filtro.iddisenador;
		elQuery.pagina = 1;

		$scope.loadingMore = {loading: true, boton: 'Cargando...'};
		ProductosCategoriaService.query(elQuery).$promise
		.then(function(productos){
			$scope.productos = [];
			$scope.loadingMore = {loading: false, boton: 'Cargar más'};
			if (productos.length < 8) { $scope.moreDataCanBeLoaded = false; }
			$scope.productos = $scope.productos.concat(productos);
			elQuery.pagina++;
		}, function(err){
			console.log(err);
			$scope.loadingMore = {loading: false, boton: 'Cargar más'};
		});
	};


}])
.controller('SingleCtrl', ['$sce', '$scope', 'SingleService', 'ProductosRelacionadosService', 'agregarProductoService', '$rootScope', 'desfavoritearService', 'favoritearService', '$stateParams', '$timeout', 'ngDialog', 'nProductosEnCarritoService',
	function($sce, $scope, SingleService, ProductosRelacionadosService, agregarProductoService, $rootScope, desfavoritearService, favoritearService, $stateParams, $timeout, ngDialog, nProductosEnCarritoService){


	$scope.producto = {};
	$scope.tallaSelected = '';
	$scope.loading = true;
	$scope.cantidad = [];
	$scope.relacionados = [];
	$scope.page = 1;


	SingleService.get({
		idproducto: $stateParams.id
	}).$promise.then(function(producto){

		$scope.producto = producto;
		$scope.producto.bigimg = producto.fotos[0].foto;
		$scope.producto.descripcionProd = $sce.trustAsHtml(producto.descripcion_prod);
		$scope.producto.cantidad = '';
		$scope.loading = false;

		$timeout(function(){
			afterLoad();
		}, 100);


		ProductosRelacionadosService.query({
			idcategoria: producto.idcategoria,
			idproducto: $stateParams.id,
			pagina: $scope.page,
			iddisenador: $scope.producto.iddisenador,
			limite: 8 }
		).$promise
		.then(function(relacionados){

			if (relacionados.length < 8) {
				$scope.moreDataCanBeLoaded = false;
			} else {
				$scope.moreDataCanBeLoaded = true;
			}

			$scope.relacionados = relacionados;
			$scope.page++;
		});
	}, function(err){
		$scope.loading = false;
		console.log(err);
	});

	$scope.ponerThumb = function($index){
		$scope.producto.bigimg = $scope.producto.fotos[$index].foto;
	};

	$scope.loadingMore = {loading: false, boton: 'Cargar más'};
	$scope.loadMore = function(){
		$scope.loadingMore = {loading: true, boton: 'Cargando...'};
		ProductosRelacionadosService.query({
			idcategoria: $scope.producto.idcategoria,
			idproducto: $stateParams.id,
			pagina: $scope.page,
			iddisenador: $scope.producto.iddisenador,
			limite: 8 }
		).$promise
		.then(function(relacionados){
			$scope.loadingMore = {loading: false, boton: 'Cargar más'};
			if (relacionados.length < 8) { $scope.moreDataCanBeLoaded = false; }
			$scope.relacionados = $scope.relacionados.concat(relacionados);
			$scope.page++;
		}, function(err){
			$scope.loadingMore = {loading: false, boton: 'Cargar más'};
			console.log(err);
		});
	};

	$scope.tallaChanged = function(talla){
		$scope.tallaSelected = talla;
		if ($scope.producto.tallas[talla].existencia > 0) {
			$scope.cantidad = [];
			for (var i = 1; i <= $scope.producto.tallas[talla].existencia; i++) {
				$scope.cantidad.push(i.toString());
			}
		} else {
			$scope.cantidad = ['0'];
		}
		$timeout(function(){
			$scope.producto.cantidad = $scope.cantidad[0];
		}, 0);
	};

	var enviar;
	$scope.favorite = function(fav){

		if ($rootScope.globals.currentUser) {
			if (fav.favoriteado === 0) {
				fav.favoriteado = 1;
			} else {
				fav.favoriteado = 0;
			}
			$timeout.cancel(enviar);

			enviar = $timeout(function(){
				if (fav.favoriteado === 0 ){
					desfavoritearService.save({idproducto: parseInt($stateParams.id)}).$promise
					.then({}, function(err){
						console.log(err);
						fav.favoriteado = 1;
					});
				} else {
					favoritearService.save({idproducto: parseInt($stateParams.id)}).$promise
					.then({}, function(err){
						console.log(err);
						fav.favoriteado = 0;
					});
				}
			}, 1000);
		} else {
			// var dialog =
			ngDialog.open({ template: 'views/loginTemplate.html', className: 'ngdialog-theme-default' });
			// dialog.closePromise.then(function () {});
		}
	};
	$scope.enviarAlCarrito = function(){

		if ($rootScope.globals.currentUser) {
			agregarProductoService.save({
				idtalla: $scope.producto.tallas[$scope.tallaSelected].idtalla,
				cantidad: $scope.producto.cantidad
			}).$promise.then(function(){
				nProductosEnCarritoService.get().$promise.then(
					function(n){
						$rootScope.productosCarrito = n.cantidad;
					});
			}, function(err){
				console.log(err);
			});
		} else {
			var dialog = ngDialog.open({ template: 'views/loginTemplate.html', className: 'ngdialog-theme-default' });
			dialog.closePromise.then(function () {
				agregarProductoService.save({
					idtalla: $scope.producto.tallas[$scope.tallaSelected].idtalla,
					cantidad: $scope.producto.cantidad
				}).$promise.then(function(){
					nProductosEnCarritoService.get().$promise.then(
						function(n){
							$rootScope.productosCarrito = n.cantidad;
						});
				}, function(err){
					console.log(err);
				});
			});
		}
	};

}])
.controller('DisenadoresCtrl', ['$scope', 'DisenadoresService', '$timeout',
	function($scope, DisenadoresService, $timeout){

	$scope.page = 1;
	$scope.disenadores = [];
	$scope.loading = true;

	DisenadoresService.query({pagina: $scope.page, limite: 10}).$promise
	.then(function(disenadores){
		$scope.disenadores = $scope.disenadores.concat(disenadores);
		$scope.page++;
		$scope.loading = false;

		if (disenadores.length < 10) {
			$scope.moreDataCanBeLoaded = false;
		} else {
			$scope.moreDataCanBeLoaded = true;
		}

		$timeout(function(){
			afterLoad();
		}, 100);
	}, function(err){
		console.log(err);
	});


	$scope.loadingMore = {loading: false, boton: 'Cargar más'};
	$scope.loadMore = function(){
		$scope.loadingMore = {loading: true, boton: 'Cargando...'};
		DisenadoresService.query({pagina: $scope.page, limite: 10}).$promise
		.then(function(disenadores){
			if (disenadores.length === 0) { $scope.moreDataCanBeLoaded = false; }
			$scope.disenadores = $scope.disenadores.concat(disenadores);
			$scope.page++;
			$scope.loadingMore = {loading: false, boton: 'Cargar más'};
		}, function(err){
			console.log(err);
			$scope.loadingMore = {loading: false, boton: 'Cargar más'};
		});
	};

}])
.controller('DisenadorCtrl', ['$timeout', '$scope', '$stateParams', 'DisenadorSingleService', 'ProductosDisenadoresService', '$sce', 'rangosService', 'tallascategoriaService', 'categoriasdisenadoresService',
	function($timeout, $scope, $stateParams, DisenadorSingleService, ProductosDisenadoresService, $sce, rangosService, tallascategoriaService, categoriasdisenadoresService){
	$scope.page = 1;
	$scope.loading = true;
	$scope.disenador = {};
	$scope.productos = [];

	$scope.filtro = {desde: '', hasta: '', tallacat: '', idcategoria: ''};
	var elQuery = {
				iddisenador: $stateParams.id,
				pagina: $scope.page,
				limite: 8,
				desde: $scope.filtro.desde,
				hasta: $scope.filtro.hasta,
				idcategoria: $scope.filtro.idcategoria
			};

	rangosService.query().$promise
	.then(function(rangos){
		$scope.rangos = rangos;
	});

	categoriasdisenadoresService.query().$promise
	.then(function(disenadorescat){
		$scope.idcategoria = disenadorescat;
	});



	DisenadorSingleService.get({iddisenador: $stateParams.id}).$promise
	.then(function(disenador){
		$scope.disenador = disenador;
		$scope.disenador.descripcionDis = $sce.trustAsHtml(disenador.descripcion_dis);
		$scope.loading = false;

		$timeout(function(){
			afterLoad();
		}, 100);

		ProductosDisenadoresService.query(elQuery).$promise
		.then(function(productos){
			$scope.productos = $scope.productos.concat(productos);
			elQuery.pagina++;

			if (productos.length < 8) {
				$scope.moreDataCanBeLoaded = false;
			} else {
				$scope.moreDataCanBeLoaded = true;
			}

		});
	}, function(err){
		console.log(err);
	});


	$scope.loadingMore = {loading: false, boton: 'Cargar más'};
	$scope.loadMore = function(){
		$scope.loadingMore = {loading: true, boton: 'Cargando...'};
		ProductosDisenadoresService.query(elQuery).$promise
		.then(function(productos){
			if (productos.length < 8) { $scope.moreDataCanBeLoaded = false; }
			$scope.loadingMore = {loading: false, boton: 'Cargar más'};
			$scope.productos = $scope.productos.concat(productos);
			elQuery.pagina++;
		}, function(err){
			console.log(err);
			$scope.loadingMore = {loading: false, boton: 'Cargar más'};
		});
	};


	$scope.precioChange = function(){
		var desdehasta = $scope.filtro.precio.split(',');

		elQuery.desde = desdehasta[0];
		elQuery.hasta = desdehasta[1];
		elQuery.pagina = 1;

		$scope.loadingMore = {loading: true, boton: 'Cargando...'};
		ProductosDisenadoresService.query(elQuery).$promise
		.then(function(productos){
			$scope.productos = [];
			$scope.loadingMore = {loading: false, boton: 'Cargar más'};
			if (productos.length < 8) { $scope.moreDataCanBeLoaded = false; }
			$scope.productos = $scope.productos.concat(productos);
			elQuery.pagina++;
		}, function(err){
			console.log(err);
			$scope.loadingMore = {loading: false, boton: 'Cargar más'};
		});
	};


	$scope.categoriaChange = function(){

		elQuery.idcategoria = $scope.filtro.idcategoria;
		elQuery.pagina = 1;

		$scope.loadingMore = {loading: true, boton: 'Cargando...'};
		ProductosDisenadoresService.query(elQuery).$promise
		.then(function(productos){
			$scope.productos = [];
			$scope.loadingMore = {loading: false, boton: 'Cargar más'};
			if (productos.length < 8) { $scope.moreDataCanBeLoaded = false; }
			$scope.productos = $scope.productos.concat(productos);
			elQuery.pagina++;
		}, function(err){
			console.log(err);
			$scope.loadingMore = {loading: false, boton: 'Cargar más'};
		});
	};


}])
.controller('WishlistCtrl', ['$scope', 'WishlistService', 'desfavoritearService', '$timeout',
	function($scope, WishlistService, desfavoritearService, $timeout){

	$scope.loading = true;
	$scope.page = 1;

	$scope.wishlist = [];

	WishlistService.query({pagina: $scope.page, limite: 8}).$promise
	.then(function(wishlist){
		$scope.loading = false;
		$timeout(function(){
			$scope.wishlist = $scope.wishlist.concat(wishlist);
		}, 1);

		if (wishlist.length < 8) {
			$scope.moreDataCanBeLoaded = false;
		} else {
			$scope.moreDataCanBeLoaded = true;
		}

		$timeout(function(){
			afterLoad();
		}, 100);

		$scope.page++;
	}, function(err){
		console.log(err);
	});

	$scope.remove = function($index) {
		desfavoritearService.save({idproducto: parseInt($scope.wishlist[$index].idproducto)});
		$scope.wishlist.splice($index, 1);
	};

	$scope.moreDataCanBeLoaded = true;
	$scope.loadingMore = {loading: false, boton: 'Cargar más'};
	$scope.loadMore = function(){
		$scope.loadingMore = {loading: true, boton: 'Cargando...'};
		WishlistService.query({pagina: $scope.page, limite: 8}).$promise
		.then(function(wishlist){
			if (wishlist.length < 8) { $scope.moreDataCanBeLoaded = false; }
			$scope.wishlist = $scope.wishlist.concat(wishlist);
			$scope.page++;
			$scope.loadingMore = {loading: false, boton: 'Cargar más'};
		}, function(err){
			console.log(err);
			$scope.loadingMore = {loading: false, boton: 'Cargar más'};
		});
	};

}])

.controller('CarritoCtrl', ['$scope', 'productosEnCarritoService', 'agregarProductoService', 'nProductosEnCarritoService', '$timeout', '$rootScope',
	function($scope, productosEnCarritoService, agregarProductoService, nProductosEnCarritoService, $timeout, $rootScope){

	$scope.loading = true;
	$scope.carrito = [];
	$scope.cantidad = {};


	$scope.getNumber = function(num) {
		return new Array(parseInt(num));
	};

	productosEnCarritoService.get().$promise.then(
		function(carrito){
			$scope.carrito = carrito.productos || [];
			$scope.cantidad = parseInt(carrito.cantidad);
			$scope.loading = false;

			$timeout(function(){
				afterLoad();
			}, 100);
		}, function(err){
			console.log(err);
		});

	$scope.changeCantidad = function(producto){

		agregarProductoService.save({
			idtalla: producto.idtalla,
			cantidad: producto.cantidad
		}).$promise.then(function(){
			nProductosEnCarritoService.get().$promise.then(
				function(n){
					$rootScope.productosCarrito = n.cantidad;
					if (n.cantidad === 0) {
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
			producto.cantidad = +producto.cantidad - 1;
			console.log(err);
		});


	};


	$scope.addItem = function(producto){

		producto.cantidad = +producto.cantidad + 1;


		agregarProductoService.save({
			idtalla: producto.idtalla,
			cantidad: producto.cantidad
		}).$promise.then(function(){
			nProductosEnCarritoService.get().$promise.then(
				function(n){
					$rootScope.productosCarrito = n.cantidad;
					if (n.cantidad === 0) {
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
			producto.cantidad = +producto.cantidad - 1;
			console.log(err);
		});

	};

	$scope.removeItem = function(producto){

		producto.cantidad = +producto.cantidad - 1;


		agregarProductoService.save({
			idtalla: producto.idtalla,
			cantidad: producto.cantidad
		}).$promise.then(function(){
			nProductosEnCarritoService.get().$promise.then(
				function(n){
					$rootScope.productosCarrito = n.cantidad;
					if (n.cantidad === 0) {
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
			producto.cantidad = +producto.cantidad + 1;
			console.log(err);
		});
	};

	$scope.removeItemFull = function(producto){

		producto.cantidad = 0;

		agregarProductoService.save({
			idtalla: producto.idtalla,
			cantidad: producto.cantidad
		}).$promise.then(function(){
			nProductosEnCarritoService.get().$promise.then(
				function(n){
					$rootScope.productosCarrito = n.cantidad;
				if (n.cantidad === 0) {
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
			console.log(err);
		});
	};


}])

.controller('DireccionesCtrl', ['$scope', '$timeout', 'estadosService', '$location', 'ciudadesService', 'urbanizacionesService', 'guardaDireccionesService', 'direccionActualService',
	function($scope, $timeout, estadosService, $location, ciudadesService, urbanizacionesService, guardaDireccionesService, direccionActualService){


	$scope.loading = true;

	$scope.util = {diferentes: false};
	$scope.shipping = {};
	$scope.billing = {};
	$scope.form = {};

	estadosService.query().$promise.then(function(estados){
		$scope.form.estados = estados;

		direccionActualService.get().$promise.then(function(billing){

			$timeout(function(){
				afterLoad();
			}, 100);

			$scope.loading = false;

			$timeout(function(){
				$scope.shipping = billing;
				billing.BillingidCI = parseInt(billing.BillingidCI);
				$scope.billing = billing;

				if ($scope.shipping.ShipToAddress !== $scope.billing.BillingAddress) {
					// $timeout(function(){
						$scope.util.diferentes = true;

						$scope.billingidestadoChange(function(){
						});
						$scope.$apply(function(){
							$scope.billingidestadoChange();
						});

						$scope.billingidciudadChange(function(){

						});
						$scope.$apply(function(){
							$scope.billingidciudadChange();
						});
						$scope.shipToidestadoChange(function(){
						});
						$scope.$apply(function(){
							$scope.shipToidestadoChange();
						});

						$scope.shipToidciudadChange(function(){

						});
						$scope.$apply(function(){
							$scope.shipToidciudadChange();
						});
					// },20)
				} else {
						$scope.billingidestadoChange(function(){
							// console.log('hey');
						});
						$scope.$apply(function(){
							$scope.billingidestadoChange();
						});

						$scope.billingidciudadChange(function(){

						});
						$scope.$apply(function(){
							$scope.billingidciudadChange();
						});
				}
			}, 20);


		});

	});

	$scope.igualChange = function(){
		$timeout(function(){
			afterLoad();
		}, 100);
	};

	$scope.billingidestadoChange = function(cb){
		ciudadesService.query({idestado: $scope.billing.Billingidestado}).$promise.then(function(ciudades){
			$scope.form.billingCiudades = ciudades;
			if (cb) { cb(); }
		});
	};

	$scope.billingidciudadChange = function(cb){
		urbanizacionesService.query({idciudad: $scope.billing.Billingidciudad}).$promise.then(function(urbanizaciones){
			$scope.form.billingUrbanizaciones = urbanizaciones;
			if (cb) { cb(); }
		});
	};
	$scope.shipToidestadoChange = function(cb){
		ciudadesService.query({idestado: $scope.shipping.ShipToidestado}).$promise.then(function(ciudades){
			$scope.form.shippingCiudades = ciudades;
			if (cb) { cb(); }
		});
	};

	$scope.shipToidciudadChange = function(cb){
		urbanizacionesService.query({idciudad: $scope.shipping.ShipToidciudad}).$promise.then(function(urbanizaciones){
			$scope.form.shippingUrbanizaciones = urbanizaciones;
			if (cb) { cb(); }
		});
	};




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
		};

		if ($scope.util.diferentes) {
			var shipping = $scope.shipping;
			direcciones.ShipToName = shipping.ShipToName;
			direcciones.ShipToidestado = shipping.ShipToidestado;
			direcciones.ShipToidciudad = shipping.ShipToidciudad;
			direcciones.ShipToidurbanizacion = shipping.ShipToidurbanizacion;
			direcciones.ShipToAddress = shipping.ShipToAddress;
			direcciones.ShipToPhone = shipping.ShipToPhone;
		} else {
			// var shipping = $scope.billing;
			direcciones.ShipToName = billing.BillingName;
			direcciones.ShipToidestado = billing.Billingidestado;
			direcciones.ShipToidciudad = billing.Billingidciudad;
			direcciones.ShipToidurbanizacion = billing.Billingidurbanizacion;
			direcciones.ShipToAddress = billing.BillingAddress;
			direcciones.ShipToPhone = billing.BillingPhone;
		}


		$scope.loading = true;
		guardaDireccionesService.save(direcciones).$promise.then(function(){
			// $ionicLoading.hide();
			$location.path('/checkout');
		}, function(err){
			$scope.loading = false;
			console.log(err);
		});

	};


}])

.controller('CheckoutCtlr', ['$rootScope', '$scope', 'guardaDireccionesService', 'checkoutService', '$location', 'nProductosEnCarritoService', '$timeout',
	function($rootScope, $scope, guardaDireccionesService, checkoutService, $location, nProductosEnCarritoService, $timeout){

	$scope.orden = {};
	$scope.loading = true;

	guardaDireccionesService.get().$promise.then(
		function(orden){
			$scope.orden = orden;
			$scope.loading = false;

			$timeout(function(){
				afterLoad();
			}, 100);

		}, function(err){
			console.log(err);
			$scope.loading = false;
		});

	$scope.pagarTransferencia = function(){
		$scope.loading = true;
		checkoutService.save({tipo: 'dt'}).$promise.then(function(){
			$scope.loading = false;
			nProductosEnCarritoService.get().$promise.then(
				function(n){
				$rootScope.productosCarrito = n.cantidad;
			});

			$location.path('/pagar-transferencia');
		}, function(err){
			$scope.loading = false;
			console.log(err);
		});
	};

}])

.controller('PagoTarjetaCtrl', ['$scope', 'guardaDireccionesService', 'checkoutService', '$rootScope', 'nProductosEnCarritoService', '$location', '$timeout', '$sce',
	function($scope, guardaDireccionesService, checkoutService, $rootScope, nProductosEnCarritoService, $location, $timeout, $sce){

	$scope.loading = true;

	$scope.ccard = {};
	$scope.util = {};

	$scope.respuesta = false;
	$scope.voucher = '';

	guardaDireccionesService.get().$promise.then(
		function(orden){
			$scope.orden = orden;
			$scope.loading = false;

			$timeout(function(){
				afterLoad();
			}, 100);

		}, function(err){
			console.log(err);
			$scope.loading = false;
		});


	$scope.cardPay = function(){
		$scope.loading = true;

		$scope.ccard.tipo = 'tc';

		checkoutService.save($scope.ccard).$promise.then(function(cardRes){
			$scope.loading = false;

			$timeout(function(){
				afterLoad();
			}, 100);

			if(cardRes.respuesta === 'Aprobada' ) {
				$scope.respuesta = 'Transacción Aprobada';
				$scope.voucher = $sce.trustAsHtml(cardRes.voucher);
				nProductosEnCarritoService.get().$promise.then(
					function(n){
					$rootScope.productosCarrito = n.cantidad;
				});
			} else {
				$scope.respuesta = 'Transacción Rechazada';
				$scope.voucher = $sce.trustAsHtml(cardRes.voucher);
			}
		}, function(err){
			$scope.loading = false;
			console.log(err);
		});

	};
}])

.controller('TransferenciaCtrl', ['$scope', 'bancosService', '$timeout',
	function($scope, bancosService, $timeout){

	$scope.bancos = [];
	$scope.loading = true;
	bancosService.query().$promise.then(
		function(bancos){
			$scope.bancos = bancos;
			$scope.loading = false;

			$timeout(function(){
				afterLoad();
			}, 100);

		}, function(err){
			console.log(err);
			$scope.loading = false;
		});

}])

.controller('PagoTransferenciaCtrl', ['$scope', '$location', 'montoOrdenService', '$stateParams', 'bancosService', 'registrarpagoService', '$timeout', 'ngDialog',
	function($scope, $location, montoOrdenService, $stateParams, bancosService, registrarpagoService, $timeout, ngDialog){

	$scope.loading = true;
	$scope.monto = {};
	$scope.bancos = [];
	$scope.trans = {};

	bancosService.query().$promise.then(
		function(bancos){
			$scope.bancos = bancos;
			$scope.loading = false;
			$scope.trans.banco = $scope.bancos[0].idbanco;

			$timeout(function(){
				afterLoad();
			}, 100);
		}, function(err){
			console.log(err);
			$scope.loading = false;
		});

	montoOrdenService.get({idorden: $stateParams.id}).$promise.then(function(monto){
		$scope.monto = monto.monto;
	});

	$scope.registrarPago = function(){
		$scope.loading = true;
		registrarpagoService.save({
			idorden: $stateParams.id,
			idbanco: $scope.trans.banco,
			confirmacion: $scope.trans.referencia
		}).$promise.then(function(){
			$scope.loading = false;
			var dialog = ngDialog.open({ template: 'views/exitoTemplate.html', className: 'ngdialog-theme-default' });
			dialog.closePromise.then(function (){
				$location.path('/');
			});
		}, function(err){
			console.log(err);
			$scope.loading = false;
		});
	};
}])

.controller('MisOrdenesCtrl', ['$scope', 'misOrdenesService', '$timeout',
	function($scope, misOrdenesService, $timeout){

	$scope.ordenes = [];
	$scope.loading = true;
	misOrdenesService.query().$promise.then(
		function(ordenes){
			$scope.loading = false;
			$scope.ordenes = ordenes;
			$timeout(function(){
				afterLoad();
			}, 100);
		},
		function(err){
			$scope.loading = false;
			console.log(err);
		});
}])
.controller('OrderSingleCtrl', ['$scope', 'ordenSingleService', '$stateParams', '$timeout',
	function($scope, ordenSingleService, $stateParams, $timeout){
	$scope.orden = [];
	$scope.loading = true;

	ordenSingleService.get({idorden: $stateParams.id}).$promise.then(
		function(orden){
			$scope.orden = orden;
			$scope.orden.idorden = $stateParams.id;
			$scope.loading = false;

			$timeout(function(){
				afterLoad();
			}, 100);

		}, function(err){
			console.log(err);
			$scope.loading = false;
		});
}])

.controller('BlogCtrl', ['$scope', 'blogService', '$timeout', function($scope, blogService, $timeout){
	$scope.loading = true;
	$scope.posts = [];
	$scope.page = 1;

	blogService.query({pagina: $scope.page, limite: 10}).$promise
	.then(function(posts){
		$scope.posts = posts;
		$scope.loading = false;
		$scope.page++;
		$timeout(function(){
			afterLoad();
		}, 100);
	});

	$scope.moreDataCanBeLoaded = true;
	$scope.loadMore = function(){
		blogService.query({pagina: $scope.page, limite: 10}).$promise
		.then(function(posts){
			if (posts.length === 0) {
				$scope.moreDataCanBeLoaded = false;
			}
			$scope.categorias = $scope.posts.concat(posts);
			$scope.page++;
			$timeout(function(){
				afterLoad();
			}, 100);
		}, function(err){
			console.log(err);
		});
	};

}])
.controller('PostCtrl', ['$scope', 'postService', '$stateParams', '$timeout', '$sce', 'blogService', function($scope, postService, $stateParams, $timeout, $sce, blogService){
	$scope.loading = true;
	$scope.posts = [];
	$scope.page = 1;
	$scope.post = {};

	postService.get({idpost: $stateParams.id}).$promise
	.then(function(post){
		$scope.post = post;
		$scope.loading = false;
		FB.XFBML.parse();
		$timeout(function(){
			afterLoad();
		}, 100);
	});

	blogService.query({pagina: 1, limite: 3, idpost: $stateParams.id}).$promise
	.then(function(posts){
		$scope.posts = posts;
		$scope.page++;
		$timeout(function(){
			afterLoad();
		}, 100);
	});

}]);
