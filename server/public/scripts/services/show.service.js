app.service('ShowService', [
  '$http',
  '$location',
  'toastr',
  '$compile',
  'ArtistImageService',
  function($http, $location, toastr, $compile, ArtistImageService) {
    var self = this;

    // Object to store my shows
    self.myShows = {};

    // Object to store current show details
    self.currentShow = {
      details: {}
    };

    // List of states for the state dropdown menu
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

    // GET My Shows from users_shows table
    self.getShows = function() {
      self.allShowYears = [];
      $http.get('/shows/myShows').then(function(response) {
        self.myShows.data = response.data;

        var allShows = self.myShows.data;

        // Add an array of all years in my shows
        allShows.forEach(function(show) {
          if (!self.allShowYears.includes(show.full_year)) {
            // console.log('already there');
            self.allShowYears.push(show.full_year);
          }
        });
        self.allShowYears.sort(function(a, b) {
          return b - a;
        });

        self.currentShowYear = self.allShowYears[0];
      });
    };

    // Manually add a show
    self.addShow = function(newShow) {
      var fullYear = newShow.show_date.getFullYear();
      $http({
        method: 'POST',
        url: '/shows/addShowManually',
        data: {
          newShow: newShow,
          full_year: fullYear
        }
      }).then(function(response) {
        let showAddedId = response.data[0].id;
        toastr.success('Show has been added');
        $location.path('/show/' + showAddedId);
      });
    };

    // GET Search Results from server
    self.searchShowResults = {};
    self.zeroSearchResults = false;
    self.numberOfSearchPages = 0;
    self.currentPageNumber = 0;

    self.searchShow = function(artist, city, venue, pageNumber) {
      self.zeroSearchResults = false;
      self.currentPageNumber = pageNumber;

      let searchButton = document.querySelector('#search-button');
      searchButton.classList.add('is-loading');

      $http({
        method: 'GET',
        url: '/shows/searchResults',
        params: {
          artist: artist,
          city: city,
          venue: venue,
          currentPageNumber: pageNumber
        }
      }).then(
        function(response) {
          self.searchResultPages = [];
          self.numberOfSearchPages = Math.ceil(
            response.data.total / response.data.itemsPerPage
          );

          for (var i = 0; i < self.numberOfSearchPages; i++) {
            self.searchResultPages.push(i + 1);
          }

          if (response.data === '') {
            self.zeroSearchResults = true;
          }
          self.searchShowResults.data = response;
          searchButton.classList.remove('is-loading');
        },
        function(data) {
          console.log('this is an error', data.config.params);
        }
      );
    };

    // Add a show from the search results
    self.addSearchedShow = function(
      artist,
      mbid,
      date,
      venue,
      city,
      state,
      version,
      sets,
      index
    ) {
      // Check to see if the show already has been added
      // self.myShows.data.forEach(function(show){
      //     if(version === show.version_id) {
      //         toastr.warning('You have already added this show.');
      //     }
      // });

      let addShowButton = document.querySelector('#add-button' + index);
      addShowButton.classList.add('is-loading');

      // setlist api date needs to be coverted to proper postgreSQL date format
      let formattedDate = self.toDate(date);

      // Format set data to send to database
      let formattedSets = getSetData(sets);
      var fullYear = formattedDate.getFullYear();

      $http({
        method: 'GET',
        url: '/shows/artistImage',
        params: {
          artist: artist
        }
      }).then(function(response) {
        // Logic to assign image to an artist
        let artistMatches = response.data.results.artistmatches.artist;
        let artistImage;

        let imageMatches = artistMatches.filter(function(artist) {
          return artist.mbid == mbid;
        });

        if (imageMatches.length != 0) {
          artistImage = imageMatches[0].image[3]['#text'];
        } else {
          artistImage =
            'https://i.pinimg.com/originals/9d/23/17/9d2317310b456185ed9663d3d7b87490.jpg';
        }

        // POST the show information to the server
        $http({
          method: 'POST',
          url: '/shows/addSearchedShow',
          data: {
            artist: artist,
            mbid: mbid,
            show_date: formattedDate,
            full_year: fullYear,
            venue: venue,
            city: city,
            state: state,
            version_id: version,
            setlist: formattedSets,
            image: artistImage
          }
        }).then(function(response) {
          let showAddedId = response.data[0].id;
          // toastr.success('Show has been added');
          toastr.success(
            '<span style="line-height:2;">' +
              artist +
              ' show added!</span> <a class="button is-small is-black" href="#/show/' +
              showAddedId +
              '">Go to show</a>',
            {
              allowHtml: true
            }
          );
          // $location.path('/show/' + showAddedId);
          ArtistImageService.getArtistImages();
          addShowButton.classList.remove('is-loading');
        });
      });
    };

    // GET All users shows
    self.getAllShows = function(showId) {
      $http({
        url: '/shows/getAllShows',
        method: 'GET'
      }).then(function(response) {
        console.log('get all shows', response.data);
        self.allUserShows = response.data;
      });
    };

    /*
    ----------------
    HELPER FUNCTIONS
    ----------------
    */

    // Clear search results
    self.clearSearchResults = function() {
      self.searchShowResults = {
        data: []
      };
    };

    // change date format coming back from setlist.fm
    self.toDate = function(dateStr) {
      const [day, month, year] = dateStr.split('-');
      return new Date(year, month - 1, day);
    };

    // Create array of songs from the setlist data object
    function getSetData(sets) {
      let songArray = [];
      sets.forEach(function(set) {
        set.song.forEach(function(song) {
          songArray.push(song.name);
        });
      });
      return songArray;
    }

    // Switch years being shown in the my shows view
    self.changeYear = function(year) {
      self.currentShowYear = year;
    };
  }
]);
