app.service('FriendService', ['$http', '$location', 'toastr', function ($http, $location, toastr) {
    var self = this;

    // Object to store current show details
    self.newFriend = {}

    self.addingFriend = {
        status: false
    }

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
            
            // self.currentShow.details = response.data;
            // var newDate = new Date(self.currentShow.details[0].show_date);
            // self.currentShow.details[0].show_date = newDate;
            // console.log('self.currentShow', self.currentShow.details);
        });
    };

    // PUT edited show info to users_shows table
    self.editShow = function (currentShow, showId) {
        $http({
            method: 'PUT',
            url: '/shows/editShow',
            data: currentShow
        })
            .then(function () {
                toastr.success('Show has been edited');
            }, function (error) {
                console.log('error', error);
                toastr.error('Edit failed');
            });
    };

    // POST show note to users_shows table
    self.addNote = function () {
        $http({
            method: 'PUT',
            url: '/shows/addNote',
            data: self.currentShow
        })
            .then(function () {
                toastr.success('Note has been added');
            }, function (error) {
                console.log('error', error);
                toastr.error('Adding note failed');
            });
    };
}]);