app.controller('NavController', ['UserService', function (UserService) {
    var self = this;
    self.userService = UserService;
}]);