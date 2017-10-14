var app = angular.module('ShowStashApp', ['ngRoute', 'toastr']);

var filestack = filestack.init('AXXO3bKGRQoif7usQg4Yfz');

/// Routes ///
app.config(function ($routeProvider, $locationProvider, toastrConfig) {
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
    .when('/home', {
      templateUrl: '/views/templates/home.html',
      controller: 'UserController as uc',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
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
    .when('/add-show', {
      templateUrl: '/views/templates/add-show.html',
      controller: 'ShowController as sc',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        },
        clearSearch: function (ShowService) {
          return ShowService.clearSearchResults();
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
    .when('/allshows', {
      templateUrl: '/views/templates/all-shows.html',
      controller: 'AllShowsController as asc',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .when('/show/:id', {
      templateUrl: 'views/templates/show.html',
      controller: 'ShowDetailController as sdc',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        },
        clearCurrentShow: function (ShowDetailService) {
          return ShowDetailService.clearCurrentShow();
        }
      }
    })
    .otherwise({
      redirectTo: 'login'
    });

  angular.extend(toastrConfig, {
    closeButton: true,
    positionClass: 'toast-top-center',
    timeOut: 5000,
    extendedTimeOut: 700
  });
});

// Custom filters
app.filter('searchDateFilter', function () {
  return function (date) {
    const [day, month, year] = date.split("-")
    return new Date(year, month - 1, day)
  }
});