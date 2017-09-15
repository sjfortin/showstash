app.controller('ShowController', ['$routeParams', 'ShowService', '$http', function ($routeParams, ShowService, $http) {
    var self = this;

    self.ShowService = ShowService; // access to all things ShowService
    
    ShowService.getShows(); // GET My Shows list on controller load
    // ShowService.getShowDetails($routeParams.id); // GET individual concert details
    
    self.myShows = ShowService.myShows; // my shows from the users_shows table
    self.states = ShowService.states.list; // state list for dropdown menu
    self.newShow = {}; // placeholder object for a newShow being added
    self.searchShowResults = ShowService.searchShowResults; // setlist data from the setlist search results
    self.orderShowsBy = '-show_date'; // default show orderBy
    self.currentShow = ShowService.currentShow; // object for the individual show

    // Manual add show POST call
    self.addShow = function () {
        ShowService.addShow(self.newShow);
        self.newShow = {};
    }   

}]);