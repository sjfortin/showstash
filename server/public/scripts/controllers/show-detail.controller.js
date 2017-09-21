app.controller('ShowDetailController', ['$routeParams', 'ShowDetailService', 'FriendService', function ($routeParams, ShowDetailService, FriendService) {
    var self = this;

    // access to all things ShowDetailService
    self.ShowDetailService = ShowDetailService;

    // GET individual concert details
    ShowDetailService.getShowDetails($routeParams.id);

    // object for the individual show listing
    self.currentShow = ShowDetailService.currentShow;

    // state list for dropdown menu
    self.states = ShowDetailService.states.list;

    self.editingMode = ShowDetailService.editingMode.status;

    // Edit show PUT call
    self.editShow = function () {
        ShowDetailService.editShow(self.currentShow, $routeParams.id);
    };

    self.addingNote = false;

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
    self.friends = FriendService.friends;

    self.newFriend = {};

    self.addingFriend = false;

    // GET friends
    FriendService.getFriends($routeParams.id);

    // POST new friend
    self.addFriend = function () {
        let currentShowId = self.currentShow.details[0].id;
        self.newFriend.showId = currentShowId;
        FriendService.addFriend(self.newFriend);
        self.newFriend = {};
        self.addingFriend = false;
    };

    // DELETE friend
    self.deleteFriend = function (friendId) {
        FriendService.deleteFriend(friendId);
    }
}]);