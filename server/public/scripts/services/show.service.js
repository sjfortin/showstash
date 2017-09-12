app.service('ShowService', ['$http', '$location', function ($http, $location) {
    var self = this;
    self.shows = {
        data: []
    };

    self.getShows = function () {
        $http.get('/shows').then(function (response) {
            console.log('Here are your shows!', response);
            self.shows.data = response.data;
        });
    };

    self.addShow = function (newShow) {
        $http.post('/shows', newShow).then(function (response) {
            console.log('add show response:', response);
        }).then(function () {
            $location.path('/add');
        });
    };

}]);