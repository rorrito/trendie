var url = "http://www.papayainteriordesign.com/sites/gotrendyapp/services/";

angular.module('trendie.controllers')
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
  }
}])

.factory('Auth', function($localstorage, $rootScope){
	return {
		saveCredentials: function(data){

			$rootScope.globals = {
				currentUser: data
			};

			$localstorage.setObject('globals',{currentUser:data});

		},
		clearCredentials: function(){
			$rootScope.globals = {};
			$localstorage.setObject('globals',{});
		}
	}
})

.factory('CategoriasInicioService',function($resource) {
	return $resource(url+'categoriasinicio');
})

.factory('RegistroService',function($resource) {
	return $resource(url+'registro');
})
.factory('LoginService',function($resource) {
	return $resource(url+'login');
})
.factory('SingleService',function($resource) {
	return $resource(url+'producto_single');
})
