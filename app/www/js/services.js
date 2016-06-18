var MD5=function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]| (G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};

var url = "http://gotrendyapp.com/restapi/";

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

.factory('Auth', function($localstorage, $rootScope, $http, elIdService, $state){
	return {
		saveCredentials: function(data){

      $http.defaults.headers.common['Token'] = data.token;

        var user;
        Ionic.io();
        user = Ionic.User.current();

        var details = {
          email: data.email,
          password: MD5(data.email+'trendieapptokensecret')
        };

        Ionic.Auth.login('basic', { remember: true }, details).then(
          function(userlogged){
            user = Ionic.User.current();
            hacerTokenPush();
          },function(err){
              if (err.response.body.meta.status === 401) {
                Ionic.Auth.signup(details).then(
                  function(registerused){
                    Ionic.Auth.login('basic', { remember: true }, details).then(
                      function(finaluser){
                        elIdService.save({idnotificaciones: finaluser.id});
                        // console.log(finaluser);
                        user = Ionic.User.current();
                        user.details.name = data.nombre;
                        hacerTokenPush()
                        user.save();
                      }, function(err){
                        console.log('error: ', err);
                      })
                  }, function(err){
                      console.log('error: ', err);
                  });
              }
          });

        function hacerTokenPush() {
        var push = new Ionic.Push({
            "debug": false,
            onNotification: function(notification){
              console.log(notification);
              if (!notification._raw.additionalData.foreground ) {
                $state.go(notification._payload.state, notification._payload.stateParams.id);
              }
            },
            "pluginConfig": {
              "ios": {
                "badge": true,
                "sound": true
              },
              "android": {
                "iconColor": "#FD858B",
                "icon": "trendie_ic"
              }
            }
          });

        push.register(function(token) {
          console.log(token);
          push.saveToken(token);
        });          
        }


			$rootScope.globals = {
				currentUser: data
			};

			$localstorage.setObject('globals',{currentUser:data});
		},
		clearCredentials: function(){
      $http.defaults.headers.common['Token'] = '';
      Ionic.io();
      Ionic.Auth.logout();
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
.factory('SearchService',function($resource, $rootScope) {
  return $resource(url+'buscar?semilla='+$rootScope.semilla);
})
.factory('WishlistService',function($resource, $rootScope) {
	return $resource(url+'wishlist');
})
.factory('agregarProductoService', function($resource){
  return $resource(url+'agregarproducto');
})
.factory('nProductosEnCarritoService', function($resource){
  return $resource(url+'nproductosencarrito');
})
.factory('productosEnCarritoService', function($resource){
  return $resource(url+'productosencarrito');
})
.factory('estadosService', function($resource){
  return $resource(url+'estados');
})
.factory('ciudadesService', function($resource){
  return $resource(url+'ciudades');
})
.factory('urbanizacionesService', function($resource){
  return $resource(url+'urbanizaciones');
})
.factory('guardaDireccionesService', function($resource){
  return $resource(url+'gurdadirecciones');
})
.factory('direccionActualService', function($resource){
  return $resource(url+'direccionactual');
})
.factory('ultimasDireccionesService', function($resource){
  return $resource(url+'ultimasdirecciones');
})
.factory('bancosService', function($resource){
  return $resource(url+'bancos');
})
.factory('checkoutService', function($resource){
  return $resource(url+'checkout');
})
.factory('misOrdenesService', function($resource){
  return $resource(url+'misordenes');
})
.factory('ordenSingleService', function($resource){
  return $resource(url+'productosOrdenes');
})
.factory('montoOrdenService', function($resource){
  return $resource(url+'montoOrden');
})
.factory('registrarpagoService', function($resource){
  return $resource(url+'registrarpago');
})
.factory('elIdService', function($resource){
  return $resource(url+'gurdaridnotificaciones');
})
.factory('mensajesService', function($resource){
  return $resource(url+'mensajes');
})
.factory('numeroMensajesService', function($resource){
  return $resource(url+'numero_mensajes');
})
.factory('blogService', function($resource){
  return $resource(url+'blog');
})
.factory('postService', function($resource){
  return $resource(url+'post');
})
