app.service('UserService', function ($http, $location) {

  var self = this;

  self.userObject = {};

  self.getuser = function () {
    $http.get('/user').then(function (response) {
      if (response.data.username) {
        // user has a curret session on the server
        self.userObject.username = response.data.username;
        self.userObject.image = response.data.image;
        self.userObject.name = response.data.name;
      } else {
        // user has no session, bounce them back to the login page
        $location.path("/login");
      }
    }, function (response) {
      $location.path("/login");
    });
  }

  self.logout = function () {
    $http.get('/user/logout').then(function (response) {
      $location.path("/login");
    });
  }

});
