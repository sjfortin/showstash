app.controller('HeaderController', ['UserService', function (UserService) {
    var self = this;
    self.userService = UserService;
}]);