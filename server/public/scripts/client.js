var app = angular.module('ShowStashApp', ['ngRoute', 'ngMaterial'])


// app.config(function ($mdThemingProvider) {

//   $mdThemingProvider.definePalette('showStashPalette', {
//     '50': 'f3f3f3',
//     '100': 'e3e3e3',
//     '200': 'd3d3d3',
//     '300': 'c3c3c3',
//     '400': 'b3b3b3',
//     '500': 'a3a3a3',
//     '600': '9a9a9a',
//     '700': '8a8a8a',
//     '800': '7a7a7a',
//     '900': '6a6a6a', 
//     'A100': '5a5a5a', 
//     'A200': '4a4a4a',
//     'A400': '3a3a3a',
//     'A700': '2a2a2a',
//     'contrastDefaultColor': 'light',
//     'contrastDarkColors': ['50', '100', '200', '300', '400', '500', '600', '700']
//   });

//   $mdThemingProvider.theme('default')
//     .primaryPalette('showStashPalette', {
//       'default': '900',
//       'hue-1': '800',
//       'hue-2': '700',
//       'hue-3': '600'
//     })
//     .accentPalette('showStashPalette', {
//       'default': 'A700'
//     })
//     .backgroundPalette('showStashPalette', {
//       'default': '50'
//     });

// });

/// Routes ///
app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
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
    .when('/profile', {
      templateUrl: '/views/templates/profile.html',
      controller: 'LoginController as lc',
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
