app.controller('ShowController', ['$routeParams', 'ShowService', '$http', '$scope', function ($routeParams, ShowService, $http, $scope) {
    var self = this;

    self.ShowService = ShowService; // access to all things ShowService
    
    ShowService.getShows(); // GET My Shows list on controller load
    
    self.myShows = ShowService.myShows; // my shows from the users_shows table
    self.states = ShowService.states.list; // state list for dropdown menu
    self.newShow = {}; // placeholder object for a newShow being added
    self.searchShowResults = ShowService.searchShowResults; // setlist data from the setlist search results
    self.orderShowsBy = '-show_date'; // default show orderBy
    self.addOwnShow = false; // manual show add form not shown by default
    self.currentShow = ShowService.currentShow; // object for the individual show

    // Manual add show POST call
    self.addShow = function () {
        ShowService.addShow(self.newShow);
        self.newShow = {};   
    }   

    // FileStack Upload
    self.addArtistImage = function () {
        filestack.pick({
            accept: 'image/*',
            fromSources: ['imagesearch', 'url', 'local_file_system'],
            transformations: {
                crop: {
                    aspectRatio: 1 / 1,
                    force: true
                }
            },
        }).then(function (result) {
            console.log(JSON.stringify(result.filesUploaded));
            self.newShow.newImage = result.filesUploaded[0].url;
            $scope.$apply();
        });
    };

}]);