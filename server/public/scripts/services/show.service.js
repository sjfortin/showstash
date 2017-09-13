app.service('ShowService', ['$http', '$location', '$mdToast', function ($http, $location, $mdToast) {
    var self = this;
    self.shows = {
        data: []
    };
    self.setlist = {
        data: []
    };

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

    // self.getSetListFm = function () {
    //     $http({
    //         method: 'GET',
    //         url: '/setlist',
    //     }).then(function (response) {
    //         console.log('This is the set list info!!!! Yea baby', response);
    //         self.setlist.data = response;
    //     });
    // }
    
    self.searchShow = function (band, city) {
        console.log('getting search');
        $http({
            method: 'GET',
            url: '/setlist/search',
            params: {
                band: band,
                city: city
            }
        }).then(function (response) {
            console.log('This is the search info!', response);
            self.setlist.data = response;
        });
    }

}]);