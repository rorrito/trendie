/* globals angular:false */
'use strict';

angular.module('gotrendy', [
	'trendy.controllers',
	'ui.router',
	'ngResource',
	'ngAnimate',
	'ngDialog',
	'credit-cards'])

	.run(['$rootScope', '$localstorage', '$http',
		function($rootScope, $localstorage, $http){

			$rootScope.semilla = Math.floor(Math.random() * 10000);
			$rootScope.globals = $localstorage.getObject('globals') || {};

			(function(d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) {
					return;
				}
				js = d.createElement(s); js.id = id;
				js.src = '//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.6&appId=';
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));

			if ($rootScope.globals.currentUser){
				$http.defaults.headers.common.Token = $rootScope.globals.currentUser.token;
			}

	}])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {


			$urlRouterProvider.otherwise('/');

			$stateProvider

				.state('home', {
					url: '/',
					views: {
						full: {
							templateUrl: 'views/home.html',
							controller: 'HomeCtlr'
						}
					}
				})
				.state('categoria', {
					url: '/categoria/:id',
					views: {
						'full': {
							templateUrl: 'views/categoria.html',
							controller: 'CategoriaCtrl'
						}
					}
				})
				.state('producto', {
					url: '/producto/:id',
					views: {
						'full': {
							templateUrl: 'views/single.html',
							controller: 'SingleCtrl'
						}
					}
				})
				.state('disenadores', {
					url: '/disenadores',
					views: {
						'full': {
							templateUrl: 'views/disenadores.html',
							controller: 'DisenadoresCtrl'
						}
					}
				})
				.state('disenador', {
					url: '/disenador/:id',
					views: {
						'full': {
							templateUrl: 'views/disenador.html',
							controller: 'DisenadorCtrl'
						}
					}
				})
				.state('wishlist', {
					url: '/wishlist',
					views: {
						'full': {
							'templateUrl': 'views/wishlist.html',
							controller: 'WishlistCtrl'
						}
					}
				})
				.state('carrito', {
					url: '/cart',
					views: {
						'full': {
							templateUrl: 'views/carrito.html',
							controller: 'CarritoCtrl'
						}
					}
				})
				.state('direcciones', {
					url: '/direcciones',
					views: {
						'full': {
							templateUrl: 'views/direcciones.html',
							controller: 'DireccionesCtrl'
						}
					}
				})
				.state('checkout', {
					url: '/checkout',
					views: {
						'full': {
							templateUrl: 'views/checkout.html',
							controller: 'CheckoutCtlr'
						}
					}
				})
				.state('pagoTarjeta', {
					url: '/pago-tarjeta',
					views: {
						'full': {
							templateUrl: 'views/pago-tarjeta.html',
							controller: 'PagoTarjetaCtrl'
						}
					}
				})
				.state('pagarTransferencia', {
					url: '/pagar-transferencia',
					views: {
						'full': {
							templateUrl: 'views/pagar-transferencia.html',
							controller: 'TransferenciaCtrl'
						}
					}
				})
				.state('pagoTransferencia', {
					url: '/pago-transferencia/:id',
					views: {
						'full': {
							templateUrl: 'views/pago-transferencia.html',
							controller: 'PagoTransferenciaCtrl'
						}
					}
				})
				.state('misOrdenes', {
					url: '/mis-ordenes',
					views: {
						'full': {
							templateUrl: 'views/mis-ordenes.html',
							controller: 'MisOrdenesCtrl'
						}
					}
				})
				.state('blog', {
					url: '/blog',
					views: {
						'full': {
							templateUrl: 'views/blog.html',
							controller: 'BlogCtrl'
						}
					}
				})
				.state('post', {
					url: '/post/:id',
					views: {
						'full': {
							templateUrl: 'views/post.html',
							controller: 'PostCtrl'
						}
					}
				})
				.state('resultado', {
					url: '/resultado/:texto',
					views: {
						'full': {
							templateUrl: 'views/resultado.html',
							controller: 'SearchCtrl'
						}
					}
				})
				.state('orden', {
					url: '/orden/:id',
					views: {
						'full': {
							templateUrl: 'views/orden.html',
							controller: 'OrderSingleCtrl'
						}
					}
				});
	}]);
