app.service('ShowService', ['$http', '$location', 'toastr', function ($http, $location, toastr) {
    var self = this;

    // Object to store my shows
    self.myShows = {};

    // Object to store show search results
    self.searchShowResults = {};

    // Object to store current show details
    self.currentShow = {
        details: {}
    }

    // List of states for the state dropdown menu
    self.states = {
        list: ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
    };

    // GET My Shows from users_shows table
    self.getShows = function () {
        $http.get('/shows/myShows')
            .then(function (response) {
                self.myShows.data = response.data;
            });
    };

    // User POST to users_shows table
    self.addShow = function (newShow) {
        $http({
            method: 'POST',
            url: '/shows/addShowManually',
            data: newShow
        })
            .then(function () {
                toastr.success('Show added!', 'Boo yah!');
                $location.path('/shows');
            });
    };

    // GET Search Results from server
    self.searchShow = function (artist, city) {
        $http({
            method: 'GET',
            url: '/shows/searchResults',
            params: {
                artist: artist,
                city: city
            }
        }).then(
            function (response) {
                console.log('search response', response);
                self.searchShowResults.data = response;
            },
            function (data) {
                console.log('this is an error', data.config.params);
            });
    };

    // POST from Search Results add button
    self.addSearchedShow = function (artist, mbid, date, venue, city, state, version, sets) {

        // Check to see if the show already has been added
        // self.myShows.data.forEach(function(show){
        //     if(version === show.version_id) {
        //         toastr.warning('You have already added this show.');
        //     }
        // });

        // setlist api date needs to be coverted to proper postgreSQL date format
        var formattedDate = self.toDate(date);

        // Format set data to send to database
        var formattedSets = getSetData(sets);

        $http({
            method: 'POST',
            url: '/shows/addSearchedShow',
            data: {
                artist: artist,
                mbid: mbid,
                show_date: formattedDate,
                venue: venue,
                city: city,
                state: state,
                version_id: version,
                setlist: formattedSets
            }
        }).then(
            function (response) {
                console.log('search show add', response);
                toastr.success('Show added!', 'Keep going!');
                $location.path('/shows');
                self.setlist = {
                    data: []
                };
            })
    };

    // DELETE individual show
    self.deleteShow = function (showId) {
        $http({
            url: '/shows/deleteShow',
            method: 'DELETE',
            params: {
                id: showId
            }
        }).then(function (response) {
            console.log('delete response', response.data);
            toastr.success('Show Deleted!');
            self.getShows();
        });
    };

    /*
    ----------------
    HELPER FUNCTIONS
    ----------------
    */

    // Clear search results
    self.clearSearchResults = function () {
        self.searchShowResults = {
            data: []
        };
    }

    // change date format coming back from setlist.fm
    self.toDate = function (dateStr) {
        const [day, month, year] = dateStr.split("-")
        return new Date(year, month - 1, day)
    };

    // Create array of songs from the setlist data object
    function getSetData(sets) {
        var songArray = [];
        sets.forEach(function (set) {
            set.song.forEach(function (song) {
                songArray.push(song.name);
            })
        });
        return songArray;
    }

}]);