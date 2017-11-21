app.service('ShowDetailService', [
  '$http',
  '$location',
  'toastr',
  function($http, $location, toastr) {
    var self = this;

    // Object to store current show details
    self.currentShow = {
      details: []
    };

    self.editingMode = {
      status: false
    };

    // State list
    self.states = {
      list: [
        'AL',
        'AK',
        'AZ',
        'AR',
        'CA',
        'CO',
        'CT',
        'DE',
        'FL',
        'GA',
        'HI',
        'ID',
        'IL',
        'IN',
        'IA',
        'KS',
        'KY',
        'LA',
        'ME',
        'MD',
        'MA',
        'MI',
        'MN',
        'MS',
        'MO',
        'MT',
        'NE',
        'NV',
        'NH',
        'NJ',
        'NM',
        'NY',
        'NC',
        'ND',
        'OH',
        'OK',
        'OR',
        'PA',
        'RI',
        'SC',
        'SD',
        'TN',
        'TX',
        'UT',
        'VT',
        'VA',
        'WA',
        'WV',
        'WI',
        'WY'
      ]
    };

    // GET individual show details
    self.getShowDetails = function(showId) {
      $http({
        url: '/shows/showDetails',
        method: 'GET',
        params: {
          id: showId
        }
      }).then(function(response) {
        self.currentShow.details = response.data;
        var newDate = new Date(self.currentShow.details[0].show_date);
        self.currentShow.details[0].show_date = newDate;
      });
    };

    // Clear search results
    self.clearCurrentShow = function() {
      self.currentShow = {
        details: []
      };
    };

    // PUT edited show info to users_shows table
    self.editShow = function(currentShow, showId) {
      console.log('edit show show id', showId);

      $http({
        method: 'PUT',
        url: '/shows/editShow',
        data: currentShow
      }).then(
        function() {
          toastr.success('Show has been edited');
          self.getShowDetails(showId);
        },
        function(error) {
          console.log('error', error);
          toastr.error('Edit failed');
        }
      );
    };

    // Update an artist image
    self.updateArtistImage = function(image, show) {
      $http({
        method: 'PUT',
        url: '/shows/updateArtistImage',
        data: {
          image: image,
          show: show.details[0].id
        }
      }).then(
        function(response) {
          toastr.success('Image has been added');
          self.getShowDetails(show.details[0].id);
        },
        function(error) {
          console.log('error', error);
          toastr.error('Image was not updated!');
        }
      );
    };

    // DELETE individual show
    self.deleteShow = function(showId) {
      $http({
        url: '/shows/deleteShow',
        method: 'DELETE',
        params: {
          id: showId
        }
      }).then(function(response) {
        toastr.success('Show Deleted');
        // self.getShows();
        $location.path('/shows/');
      });
    };

    /*
    ---------------
    NOTES
    ---------------
    */

    // POST show note to users_shows table
    self.addNote = function() {
      $http({
        method: 'PUT',
        url: '/shows/addNote',
        data: self.currentShow
      }).then(
        function() {
          toastr.success('Note has been added');
        },
        function(error) {
          console.log('error', error);
          toastr.error('Adding note failed');
        }
      );
    };
  }
]);
