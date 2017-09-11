app.service('ShowService', ['$http', function ($http) {
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

}]);