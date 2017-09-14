app.controller('ShowDetailController', ['$routeParams', 'ShowDetailService', function ($routeParams, ShowDetailService) {
    var self = this;

    console.log('routeParams', $routeParams);
    
    self.ShowDetailService = ShowDetailService; // access to all things ShowService
    ShowDetailService.getShowDetails($routeParams.id); // GET individual concert details
    self.currentShow = ShowDetailService.currentShow;

}]);