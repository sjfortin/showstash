app.controller('ShowDetailController', ['$routeParams', 'ShowDetailService', function ($routeParams, ShowDetailService) {
    var self = this;
    
    self.ShowDetailService = ShowDetailService; // access to all things ShowService
    ShowDetailService.getShowDetails($routeParams.id); // GET individual concert details
    self.currentShow = ShowDetailService.currentShow; // object for the individual show listing
    self.editingMode = ShowDetailService.editingMode.status;
    self.states = ShowDetailService.states.list; // state list for dropdown menu
    self.addingNote = false;

    // Edit show PUT call
    self.editShow = function() {                
        ShowDetailService.editShow(self.currentShow, $routeParams.id);
    };

    // Add show note POST call
    self.addNote = function() {   
        ShowDetailService.addNote();
    };   
}]);