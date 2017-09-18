app.service('ShowDetailService', ['$http', '$location', 'toastr', function ($http, $location, toastr) {
    var self = this;

    // Object to store current show details
    self.currentShow = {
        details: {}
    }

    self.editingMode = {
        status: false
    }

    // State list
    self.states = {
        list: ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
    };

    // GET individual show details
    self.getShowDetails = function (showId) {
        $http({
            url: '/shows/showDetails',
            method: 'GET',
            params: {
                id: showId
            }
        }).then(function (response) {
            console.log('self.currentShow', self.currentShow.details);
            self.currentShow.details = response.data;
            var newDate = new Date(self.currentShow.details[0].show_date);
            self.currentShow.details[0].show_date = newDate;
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

    /*
    ---------------
    NOTES
    ---------------
    */

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


    /* 
    ---------------
    FRIENDS
    ---------------
    */

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