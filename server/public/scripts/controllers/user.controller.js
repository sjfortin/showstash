app.controller('UserController', function(UserService) {
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
});
