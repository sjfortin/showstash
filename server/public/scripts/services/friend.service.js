app.service('FriendService', ['$http', '$location', 'toastr', function ($http, $location, toastr) {
    var self = this;

    self.newFriend = {
        data: []
    };

    // object stores all friends
    self.friends = {
        list: []
    };

    // GET friends
    self.getFriends = function (showId) {
        $http({
            url: '/friends/getFriends',
            method: 'GET',
            params: {
                id: showId
            }
        }).then(function (response) {
            console.log('response', response.data);
            self.friends.list = response.data;
        });
    };

    // Add friend
    self.addFriend = function (newFriend) {
        $http({
            method: 'POST',
            url: '/friends/addFriend',
            data: newFriend
        })
            .then(function (response) {
                toastr.success('Friend has been added');
                let userShowId = response.data[0].user_show;
                self.getFriends(userShowId);
            }, function (error) {
                console.log('error', error);
                toastr.error('Adding friend failed');
            });
    };

    // Delete friend
    self.deleteFriend = function (friendId) {
        $http({
            method: 'DELETE',
            url: '/friends/deleteFriend',
            params: {
                id: friendId
            }
        })
            .then(function (response) {
                toastr.success('Friend has been deleted');
                let userShowId = response.data[0].user_show;
                self.getFriends(userShowId);
            })
    }
}]);