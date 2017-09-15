app.controller('ShowDetailController', ['$routeParams', 'ShowDetailService', function ($routeParams, ShowDetailService) {
    var self = this;
    
    self.ShowDetailService = ShowDetailService; // access to all things ShowService
    ShowDetailService.getShowDetails($routeParams.id); // GET individual concert details
    self.currentShow = ShowDetailService.currentShow; // object for the individual show listing
    self.editingMode = false;
    self.states = ShowDetailService.states.list; // state list for dropdown menu

    // Edit show POST call
    self.editShow = function() {                
        ShowDetailService.editShow(self.currentShow);
    }   

}]);