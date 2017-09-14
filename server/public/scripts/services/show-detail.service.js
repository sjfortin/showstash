app.service('ShowDetailService', ['$http', function ($http) {
    var self = this;

    // Object to store current show details
    self.currentShow = {
        details: {}
    }

    // GET individual show details
    self.getShowDetails = function (showId) {
        $http({
            url: '/shows/showDetails',
            method: 'GET',
            params: {
                id: showId
            }
        }).then(function (response) {
            console.log('show details response.data', response.data);
            self.currentShow.details = response.data;
        });
    }

}]);