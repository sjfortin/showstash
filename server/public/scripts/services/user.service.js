app.service('UserService', function ($http, $location) {

  var self = this;

  self.userObject = {};

  self.getuser = function () {
    $http.get('/user').then(function (response) {
      if (response.data.email) {
        // user has a curret session on the server
        self.userObject.email = response.data.email;
        self.userObject.first_name = response.data.first_name;
        self.userObject.last_name = response.data.last_name;
      } else {
        // user has no session, bounce them back to the login page
        $location.path("/home");
      }
    }, function (response) {
      $location.path("/home");
    });
  }

  self.logout = function () {
    $http.get('/user/logout').then(function (response) {
      $location.path("/login");
    });
  }

});
