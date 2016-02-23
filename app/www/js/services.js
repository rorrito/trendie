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

.factory('Auth', function($localstorage, $rootScope, $http){
	return {
		saveCredentials: function(data){

      $http.defaults.headers.common['Token'] = data.token;

			$rootScope.globals = {
				currentUser: data
			};

			$localstorage.setObject('globals',{currentUser:data});


        Ionic.io();
        var push = new Ionic.Push({
          // "debug": true,
          onNotification: function(notification){
            if (!notification._raw.additionalData.foreground ) {
              $state.go(notification._payload.state, JSON.parse(notification._payload.stateParams));
            }
          },
          "pluginConfig": {
            "ios": {
              "badge": true,
              "sound": true
            },
            "android": {
              "iconColor": "#fb7d00",
              "icon": "bitely_ic"
            }
          }
        });

        push.register(function(pushToken) {
          var user = Ionic.User.current();
          user.id = data.id;
          // user.set('image', todalainfo.picture);
          user.set('name', data.nombre);
          console.log("Device token:",pushToken.token);
          user.addPushToken(pushToken);
          user.save();
        });

		},
		clearCredentials: function(){
      $http.defaults.headers.common['Token'] = '';
			$rootScope.globals = {};
			$localstorage.remove('globals');
			$localstorage.remove('ionic_io_push_token');
			$localstorage.remove('ionic_io_user_6f21c19c');
		}
	}
})


.factory('RegistroService',function($resource) {
	return $resource(url+'registro');
})
.factory('LoginService',function($resource) {
	return $resource(url+'login');
})
.factory('CategoriasInicioService',function($resource, $rootScope) {
	return $resource(url+'categoriasinicio?semilla='+$rootScope.semilla);
})
.factory('SingleService',function($resource, $rootScope) {
	return $resource(url+'producto_single?semilla='+$rootScope.semilla);
})
.factory('CategoriaService',function($resource, $rootScope) {
	return $resource(url+'categoria_single?semilla='+$rootScope.semilla);
})
.factory('ProductosCategoriaService',function($resource, $rootScope) {
	return $resource(url+'productoscategorias?semilla='+$rootScope.semilla);
})
.factory('ProductosRelacionadosService',function($resource, $rootScope) {
  return $resource(url+'productosrelacionados?semilla='+$rootScope.semilla);
})
.factory('ForgotService',function($resource, $rootScope) {
  return $resource(url+'recordarclave');
})
.factory('favoritearService',function($resource, $rootScope) {
	return $resource(url+'favoritear');
})
.factory('desfavoritearService',function($resource, $rootScope) {
	return $resource(url+'desfavoritear');
})
.factory('DisenadoresService',function($resource, $rootScope) {
	return $resource(url+'disenadores?semilla='+$rootScope.semilla);
})
.factory('DisenadorSingleService',function($resource, $rootScope) {
	return $resource(url+'disenador_single?semilla='+$rootScope.semilla);
})
.factory('ProductosDisenadoresService',function($resource, $rootScope) {
	return $resource(url+'productosdisenadores?semilla='+$rootScope.semilla);
})
.factory('WishlistService',function($resource, $rootScope) {
	return $resource(url+'wishlist');
})
.factory('agregarProductoService', function($resource){
  return $resource(url+'agregarproducto');
})
.factory('productosEnCarritoService', function($resource){
  return $resource(url+'nproductosencarrito');
})
