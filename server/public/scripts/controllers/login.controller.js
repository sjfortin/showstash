app.controller('LoginController', function($http, $location, UserService) {
    var vm = this;
    vm.user = {
      email: '',
      password: '',
      first_name: '',
      last_name: ''
    };
    vm.message = '';

    vm.login = function() {
      if(vm.user.email === '' || vm.user.password === '') {
        vm.message = "Enter your email and password!";
      } else {
        $http.post('/', vm.user).then(function(response) {
          if(response.data.email) {
            // location works with SPA (ng-route)
            $location.path('/user'); // http://localhost:5000/#/user
          } else {
            vm.message = "Please try again.";
          }
        }).catch(function(response){
          vm.message = "Please try again.";
        });
      }
    };

    vm.registerUser = function() {
      if (vm.user.email === '' || vm.user.password === '' || vm.user.first_name === '' || vm.user.last_name === '') {
        vm.message = "Please enter your name, email, or password.";
      } else {
        $http.post('/register', vm.user).then(function(response) {
          $location.path('/home');
        }).catch(function(response) {
          vm.message = "Please try again."
        });
      }
    }
});
