var app = angular.module('ShowStashApp', ['ngRoute', 'ngMaterial']).config(function ($mdThemingProvider) {

  $mdThemingProvider.theme('default')
    .primaryPalette('blue', {
      'default': '900',
      'hue-1': '100',
      'hue-2': '500',
      'hue-3': 'A100'
    })
    .accentPalette('grey', {
      'default': '50',
      'hue-1': '100',
      'hue-2': '500',
      'hue-3': 'A100'
    })
    .backgroundPalette('blue', {
      'default': '50',
      'hue-1': '100',
      'hue-2': '500',
      'hue-3': 'A100'
    });

});

/// Routes ///
app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  console.log('app -- config')
  $routeProvider
    .when('/login', {
      templateUrl: '/views/templates/login.html',
      controller: 'LoginController as lc',
    })
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'LoginController as lc'
    })
    .when('/user', {
      templateUrl: '/views/templates/user.html',
      controller: 'UserController as uc',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .when('/shows', {
      templateUrl: '/views/templates/shows.html',
      controller: 'ShowController as sc',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .when('/add', {
      templateUrl: '/views/templates/add.html',
      controller: 'ShowController as sc',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .when('/info', {
      templateUrl: '/views/templates/info.html',
      controller: 'InfoController',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .otherwise({
      redirectTo: 'login'
    });
});
