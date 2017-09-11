app.controller('ShowController', ['ShowService', 'UserService', function (ShowService, UserService) {
    console.log('ShowController created');
    var vm = this;
    vm.userService = UserService;
    vm.shows = ShowService.shows;
    ShowService.getShows();
}]);
