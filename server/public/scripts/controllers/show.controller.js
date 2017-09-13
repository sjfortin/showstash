app.controller('ShowController', ['ShowService', '$mdToast', function (ShowService, $mdToast) {
    var self = this;

    self.ShowService = ShowService;
    
    // GET My Shows list on controller load
    ShowService.getShows();
    
    self.shows = ShowService.shows;
    self.states = ShowService.states.list;
    self.newShow = {};
    self.setlist = ShowService.setlist;
    self.orderShowsBy = '-show_date';

    // Call the add show function
    self.addShow = function (event) {
        ShowService.addShow(self.newShow);
        self.newShow = {};
    }

}]);