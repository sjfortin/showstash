app.controller('ShowController', ['ShowService', 'UserService', function (ShowService, UserService) {
    var self = this;

    self.userService = UserService;
    self.shows = ShowService.shows;

    ShowService.getShows();

    // Manual add show
    self.newShow = {};
    self.addShow = function () {
        ShowService.addShow(self.newShow);
        self.newShow = {};
    }

    // list for state dropdown menu
    self.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY').split(' ');
}]);