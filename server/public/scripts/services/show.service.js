app.service('ShowService', ['$http', '$location', '$mdToast', function ($http, $location, $mdToast) {
    var self = this;

    // Object to store my shows
    self.myShows = {};

    // Object to store show search results
    self.searchShowResults = {};

    // Object to store current show details
    self.currentShow = {
        details: {}
    }

    // Set searching to false initially
    self.searching = false;

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
                $location.path('/shows');
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Show has been added!')
                        .action('OK')
                        .hideDelay(3000)
                );
            });
    };

    // GET Search Results from server
    self.searchShow = function (band, city) {
        self.searching = true;
        $http({
            method: 'GET',
            url: '/shows/searchResults',
            params: {
                band: band,
                city: city
            }
        }).then(
            function (response) {
                console.log('search response', response);
                self.searching = false;
                self.searchShowResults.data = response;
            },
            function (data) {
                console.log('this is an error', data.config.params);
            });
    };

    // POST from Search Results add button
    self.addSearchedShow = function (band, date, venue, city, state, version, sets) {

        // setlist api date needs to be coverted to proper postgreSQL date format
        var formattedDate = toDate(date);

        // Format set data to send to database
        var formattedSets = getSetData(sets);

        $http({
            method: 'POST',
            url: '/shows/addSearchedShow',
            data: {
                band: band,
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
                $location.path('/shows');
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Show has been added!')
                        .action('OK')
                        .hideDelay(3000)
                );
                self.setlist = {
                    data: []
                };
            })
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
    function toDate(dateStr) {
        const [day, month, year] = dateStr.split("-")
        return new Date(year, month - 1, day)
    };

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