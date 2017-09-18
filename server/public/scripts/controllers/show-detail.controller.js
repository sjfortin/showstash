app.controller('ShowDetailController', ['$routeParams', 'ShowDetailService', function ($routeParams, ShowDetailService) {
    var self = this;

    // access to all things ShowService
    self.ShowDetailService = ShowDetailService;

    // GET individual concert details
    ShowDetailService.getShowDetails($routeParams.id);

    // object for the individual show listing
    self.currentShow = ShowDetailService.currentShow;

    // state list for dropdown menu
    self.states = ShowDetailService.states.list;

    self.editingMode = ShowDetailService.editingMode.status;

    self.addingNote = false;

    // Edit show PUT call
    self.editShow = function () {
        ShowDetailService.editShow(self.currentShow, $routeParams.id);
    };

    // Add show note POST call
    self.addNote = function () {
        ShowDetailService.addNote();
    };


    /* 
    -------------
    FRIENDS
    -------------
    */

    // object for friends
    self.friends = ShowDetailService.friends;

    self.newFriend = {};

    // GET friends
    ShowDetailService.getFriends($routeParams.id);

    // POST new friend
    self.addFriend = function () {
        let currentShowId = self.currentShow.details[0].id;
        self.newFriend.showId = currentShowId;
        ShowDetailService.addFriend(self.newFriend);
    };

    // DELETE friend
    self.deleteFriend = function (friendId) {
        ShowDetailService.deleteFriend(friendId);
    }
}]);