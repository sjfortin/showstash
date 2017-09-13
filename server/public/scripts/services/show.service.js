app.service('ShowService', ['$http', '$location', '$mdToast', function ($http, $location, $mdToast) {
    var self = this;
    self.shows = {
        data: []
    };
    self.setlist = {
        data: []
    };
    self.manualAddForm = false;

    self.searching = false;

    self.states = {
        list: ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
    };

    // GET My shows from the db
    self.getShows = function () {
        $http.get('/shows')
            .then(function (response) {
                self.shows.data = response.data;
            });
    };

    // Manual Add Show
    self.addShow = function (newShow) {
        $http.post('/shows', newShow)
            .then(function () {
                $location.path('/add');
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Show has been added!')
                        .action('OK')
                        .hideDelay(3000)
                );
            });
    };

    // GET the search results
    self.searchShow = function (band, city) {
        self.searching = true;
        $http({
            method: 'GET',
            url: '/setlist/search',
            params: {
                band: band,
                city: city
            }
        }).then(
            function (response) {
                console.log('search response', response);
                self.searching = false;

                self.setlist.data = response;

                if (response.status === 204) {
                    self.manualAddForm = true;
                } else {
                    self.manualAddForm = false;
                }
            },
            function (data) {
                console.log('this is an error', data.config.params);
            });
    };

    // Function to post a show from the add result in search results
    self.addSearchedShow = function (band, date, venue, city, state, version) {

        // setlist api date needs to be coverted to proper postgreSQL date format
        var formattedDate = toDate(date);

        $http({
            method: 'POST',
            url: '/setlist/addShow',
            data: {
                band: band,
                show_date: formattedDate,
                venue: venue,
                city: city,
                state: state,
                version_id: version
            }
        }).then(
            function (response) {
                console.log('search show add', response);
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Show has been added!')
                        .action('OK')
                        .hideDelay(3000)
                );
                $location.path('/shows');
                self.setlist = {
                    data: []
                };
            })
    };

    // Clear search results
    self.clearSearchResults = function () {
        self.setlist = {
            data: []
        };
    }

    // change date format coming back from setlist.fm
    function toDate(dateStr) {
        const [day, month, year] = dateStr.split("-")
        return new Date(year, month - 1, day)
    };

}]);