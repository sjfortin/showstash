app.service('ShowService', ['$http', '$location', '$mdToast', function ($http, $location, $mdToast) {
    var self = this;
    self.shows = {
        data: []
    };
    self.setlist = {
        data: []
    };
    self.manualAddForm = false;

    self.states = {
        list: ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
    };

    self.getShows = function () {
        $http.get('/shows')
            .then(function (response) {
                self.shows.data = response.data;
            });
    };

    self.addShow = function (newShow) {
        $http.post('/shows', newShow)
            .then(function () {
                $location.path('/add');
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Show has been added!')
                        .action('OK')
                        .capsule(true)
                        .hideDelay(3000)
                );
            });
    };

    self.searchShow = function (band, city) {
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
    }

    self.addSearchedShow = function (band, date, venue, city, state) {
        var formattedDate = toDate(date);
        console.log('formattedDate', formattedDate);
        
            $http({
                method: 'POST',
                url: '/setlist/addShow',
                data: {
                    band: band,
                    show_date: formattedDate,
                    venue: venue,
                    city: city,
                    state: state
                }
            })
                .then(
                function (response) {
                    console.log('search show add', response);
                    $location.path('/add');
                }
                )
    }

    function toDate(dateStr) {
        const [day, month, year] = dateStr.split("-")
        return new Date(year, month - 1, day)
    }

}]);