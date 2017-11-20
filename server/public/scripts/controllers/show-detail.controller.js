app.controller('ShowDetailController', [
  '$routeParams',
  'ShowDetailService',
  'FriendService',
  '$scope',
  function($routeParams, ShowDetailService, FriendService, $scope) {
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
    self.editShow = function() {
      ShowDetailService.editShow(self.currentShow, $routeParams.id);
    };

    // Add an image to be sent to the editShow route
    self.addArtistImage = function() {
      filestack
        .pick({
          accept: 'image/*',
          fromSources: ['imagesearch', 'url', 'local_file_system'],
          transformations: {
            crop: {
              aspectRatio: 1 / 1,
              force: true
            }
          }
        })
        .then(function(result) {
          self.currentShow.details[0].newImage = result.filesUploaded[0].url;
          $scope.$apply();
        });
    };

    // Add an image to be sent to the editShow route
    self.updateArtistImage = function() {
      filestack
        .pick({
          accept: 'image/*',
          fromSources: ['imagesearch', 'url', 'local_file_system'],
          transformations: {
            crop: {
              aspectRatio: 1 / 1,
              force: true
            }
          }
        })
        .then(function(result) {
          ShowDetailService.updateArtistImage(result.filesUploaded[0].url, self.currentShow);
        });
    };

    // Add show note POST call
    self.addingNote = false;

    self.addNote = function() {
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
    self.addFriend = function() {
      let currentShowId = self.currentShow.details[0].id;
      self.newFriend.showId = currentShowId;
      FriendService.addFriend(self.newFriend);
      self.newFriend = {};
      self.addingFriend = false;
    };

    // DELETE friend
    self.deleteFriend = function(friendId) {
      FriendService.deleteFriend(friendId);
    };
  }
]);
