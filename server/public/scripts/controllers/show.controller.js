app.controller('ShowsController', function (ShowService) {
    console.log('ShowsController created');
    var vm = this;
    vm.shows = ShowService.shows;
    ShowService.getShows();
});
