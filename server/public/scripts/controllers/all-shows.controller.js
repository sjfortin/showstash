app.controller('AllShowsController', ['ShowService', function (ShowService) {
    var self = this;
    self.ShowService = ShowService;

    (self.getAllShows = function() {
        ShowService.getAllShows();
    })();

    self.allUserShows = ShowService.allUserShows;

}]);