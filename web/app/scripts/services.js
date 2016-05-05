/* globals angular: false */
'use strict';

var url = "http://gotrendyapp.com/restapi/";

angular.module('trendy.controllers')
.factory('UserService', function(){
	return true;
})

.factory('$localstorage', ['$window', function($window) {
	return {
		set: function(key, value) {
			$window.localStorage[key] = value;
		},
		get: function(key, defaultValue) {
			return $window.localStorage[key] || defaultValue;
		},
		setObject: function(key, value) {
			$window.localStorage[key] = JSON.stringify(value);
		},
		getObject: function(key) {
			return JSON.parse($window.localStorage[key] || '{}');
		},
		remove: function(key) {
			return $window.localStorage.removeItem(key);
		}
	};
}])

.factory('Auth', ['$localstorage', '$rootScope', '$http', function($localstorage, $rootScope, $http){
	return {
		saveCredentials: function(data){

			$http.defaults.headers.common.Token = data.token;

			$rootScope.globals = {
				currentUser: data
			};

			$localstorage.setObject('globals', {currentUser: data});
		},
		clearCredentials: function(){
			$http.defaults.headers.common.Token = '';
			$rootScope.globals = {};
			$localstorage.remove('globals');
		}
	};
}])


.factory('RegistroService', ['$resource', function($resource) {
	return $resource(url + 'registro');
}])
.factory('LoginService', ['$resource', function($resource) {
	return $resource(url + 'login');
}])
.factory('CategoriasInicioService', ['$resource', '$rootScope', function($resource, $rootScope) {
	return $resource(url + 'categoriasinicio?semilla=' + $rootScope.semilla);
}])
.factory('SingleService', ['$resource', '$rootScope', function($resource, $rootScope) {
	return $resource(url + 'producto_single?semilla=' + $rootScope.semilla);
}])
.factory('CategoriaService', ['$resource', '$rootScope', function($resource, $rootScope) {
	return $resource(url + 'categoria_single?semilla=' + $rootScope.semilla);
}])
.factory('ProductosCategoriaService', ['$resource', '$rootScope', function($resource, $rootScope) {
	return $resource(url + 'productoscategorias?semilla=' + $rootScope.semilla);
}])
.factory('ProductosRelacionadosService', ['$resource', '$rootScope', function($resource, $rootScope) {
	return $resource(url + 'productosrelacionados?semilla=' + $rootScope.semilla);
}])
.factory('ForgotService', ['$resource', function($resource) {
	return $resource(url + 'recordarclave');
}])
.factory('favoritearService', ['$resource', function($resource) {
	return $resource(url + 'favoritear');
}])
.factory('desfavoritearService', ['$resource', function($resource) {
	return $resource(url + 'desfavoritear');
}])
.factory('DisenadoresService', ['$resource', '$rootScope', function($resource, $rootScope) {
	return $resource(url + 'disenadores?semilla=' + $rootScope.semilla);
}])
.factory('DisenadorSingleService', ['$resource', '$rootScope', function($resource, $rootScope) {
	return $resource(url + 'disenador_single?semilla=' + $rootScope.semilla);
}])
.factory('ProductosDisenadoresService', ['$resource', '$rootScope', function($resource, $rootScope) {
	return $resource(url + 'productosdisenadores?semilla=' + $rootScope.semilla);
}])
.factory('WishlistService', ['$resource', function($resource) {
	return $resource(url + 'wishlist');
}])
.factory('agregarProductoService', ['$resource', function($resource){
	return $resource(url + 'agregarproducto');
}])
.factory('nProductosEnCarritoService', ['$resource', function($resource){
	return $resource(url + 'nproductosencarrito');
}])
.factory('productosEnCarritoService', ['$resource', function($resource){
	return $resource(url + 'productosencarrito');
}])
.factory('estadosService', ['$resource', function($resource){
	return $resource(url + 'estados');
}])
.factory('ciudadesService', ['$resource', function($resource){
	return $resource(url + 'ciudades');
}])
.factory('urbanizacionesService', ['$resource', function($resource){
	return $resource(url + 'urbanizaciones');
}])
.factory('guardaDireccionesService', ['$resource', function($resource){
	return $resource(url + 'gurdadirecciones');
}])
.factory('direccionActualService', ['$resource', function($resource){
	return $resource(url + 'direccionactual');
}])
.factory('ultimasDireccionesService', function($resource){
  return $resource(url+'ultimasdirecciones');
})
.factory('bancosService', ['$resource', function($resource){
	return $resource(url + 'bancos');
}])
.factory('checkoutService', ['$resource', function($resource){
	return $resource(url + 'checkout');
}])
.factory('misOrdenesService', ['$resource', function($resource){
	return $resource(url + 'misordenes');
}])
.factory('ordenSingleService', ['$resource', function($resource){
	return $resource(url + 'productosOrdenes');
}])
.factory('montoOrdenService', ['$resource', function($resource){
	return $resource(url + 'montoOrden');
}])
.factory('registrarpagoService', ['$resource', function($resource){
	return $resource(url + 'registrarpago');
}])
.factory('rangosService', ['$resource', function($resource){
	return $resource(url + 'rangos');
}])
.factory('tallascategoriaService', ['$resource', function($resource){
	return $resource(url + 'tallascategoria');
}])
.factory('disenadorescategoriasService', ['$resource', function($resource){
	return $resource(url + 'disenadorescategorias');
}])
.factory('categoriasdisenadoresService', ['$resource', function($resource){
	return $resource(url + 'categoriasdisenadores');
}])
.factory('elIdService', ['$resource', function($resource){
	return $resource(url + 'gurdaridnotificaciones');
}]);
