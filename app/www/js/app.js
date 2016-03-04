angular.module('trendie', ['ionic', 'ionic.service.core', 'trendie.controllers', 'ngResource', 'angular-carousel'])

.run(function($ionicPlatform, $rootScope, $localstorage, $http, $location) {


    $rootScope.semilla = Math.floor(Math.random()*10000);
    $rootScope.globals = $localstorage.getObject('globals') || {};

    // if ($rootScope.globals.currentUser){

    //   $http.defaults.headers.common['Token'] = $rootScope.globals.currentUser.token;

    //   Ionic.User.load($rootScope.globals.currentUser.id).then(
    //     function(loadedUser){
    //       Ionic.User.current(loadedUser);
    //       user = Ionic.User.current();
    //     }, 
    //     function(error){
    //       console.log('something went wrong: ',error);
    //     });
    // }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
      if ( ($location.path() !== '/login' && $location.path() !== '/register' && $location.path() !== '/forgot' )  && !$rootScope.globals.currentUser) {
        $location.path('/login');
      }
    });     
  $ionicPlatform.ready(function() {
    

    if ($rootScope.globals.currentUser){

    $localstorage.remove('ionic_io_user_6f21c19c');
    Ionic.io();
    Ionic.User.load($rootScope.globals.currentUser.id).then(
      function(loadedUser){
        Ionic.User.current(loadedUser);
        user = Ionic.User.current();
      }, 
      function(error){
        console.log('something went wrong: ',error);
      });

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
        user.id = $rootScope.globals.currentUser.id;
        user.set('name', $rootScope.globals.currentUser.nombre);
       // user.set('image', todalainfo.picture);
        console.log("Device token:",pushToken.token);
        user.addPushToken(pushToken);
        user.save();
      });   



    }


    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }

    if (window.StatusBar) {
      if (ionic.Platform.isAndroid()) {
        StatusBar.backgroundColorByHexString('#57828C');
      } else {
        // StatusBar.styleLightContent();
      }
    }    
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('login', {
      url: '/login',
      cache:false,
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })

    .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'RegisterCtrl'
    })

    .state('forgot', {
      url: '/forgot',
      templateUrl: 'templates/forgot.html',
      controller: 'ForgotCtrl'
    })

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })
  .state('app.single', {
    url: '/single/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/single.html',
        controller: 'SingleCtrl'
      }
    }
  })
  .state('app.categoria', {
    url: '/categoria/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/categoria.html',
        controller: 'CategoriaCtrl'
      }
    }
  })
  .state('app.disenadores', {
    url: '/disenadores',
    views: {
      'menuContent': {
        templateUrl: 'templates/disenadores.html',
        controller: 'DisenadoresCtrl'
      }
    }
  })
  .state('app.disenador',{
    url: '/disenador/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/disenador.html',
        controller: 'DisenadorCtrl'
      }
    }
  })
  .state('app.wishlist',{
    url: '/wishlist',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/wishlist.html',
        controller: 'WishlistCtrl'
      }
    }
  })
  .state('app.blog', {
    url:'/blog',
    views: {
      'menuContent': {
        templateUrl: 'templates/blog.html',
        controller: 'BlogCtrl'
      }
    }
  })
  .state('app.carrito', {
    url: '/carrito',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/carrito.html',
        controller: 'CarritoCtrl'
      }
    }
  })
  .state('app.direcciones', {
    url:'/direcciones',
    views: {
      'menuContent': {
        templateUrl: 'templates/direcciones.html',
        controller: 'DireccionesCtrl'
      }
    }
  })
  .state('app.checkout', {
    url: '/checkout',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/checkout.html',
        controller: 'CheckoutCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
