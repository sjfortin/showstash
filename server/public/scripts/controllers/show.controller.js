app.controller('ShowController', ['ShowService', '$mdToast', function (ShowService, $mdToast) {
    var self = this;

    self.ShowService = ShowService; // access to all things ShowService
    
    ShowService.getShows(); // GET My Shows list on controller load
    
    self.shows = ShowService.shows; // my shows from the users_shows table
    self.states = ShowService.states.list; // state list for dropdown menu
    self.newShow = {}; // placeholder object for a newShow being added
    self.setlist = ShowService.setlist; // setlist data from the setlist search results
    self.orderShowsBy = '-show_date'; // default show orderBy

    // Manual add show POST call
    self.addShow = function (event) {
        ShowService.addShow(self.newShow);
        self.newShow = {};
    }

}]);