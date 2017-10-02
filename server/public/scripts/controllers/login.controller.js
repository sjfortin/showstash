app.controller('LoginController', function ($http, $location, UserService) {
  var vm = this;
  vm.user = {
    username: '',
    password: ''
  };
  vm.message = '';

  vm.userObject = UserService.userObject;

  vm.userService = UserService;

  vm.login = function () {
    if (vm.user.username === '' || vm.user.password === '') {
      if (vm.user.username === '') {
        vm.message = "Please enter your username.";
      } else if (vm.user.password === '') {
        vm.message = "Please enter your password.";
      }
    } else {
      $http.post('/', vm.user).then(function (response) {
        if (response.data.username) {
          $location.path('/home');
        } else {
          vm.message = "Please try again.";
        }
      }).catch(function (response) {
        vm.message = "Please try again.";
      });
    }
  };

  vm.registerUser = function () {
    if (vm.user.password === '' || vm.user.username === '') {
      if (vm.user.username === '') {
        vm.message = "Please enter a username.";
      } else if (vm.user.password === '') {
        vm.message = "Please enter a password.";
      }
    } else {
      $http.post('/register', vm.user).then(function (response) {
        $location.path('/home');
      }).catch(function (response) {
        vm.message = "Please try again."
      });
    }
  }
});
