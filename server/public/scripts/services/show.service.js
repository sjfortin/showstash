app.service('ShowService', ['$http', '$location', 'toastr', '$compile', function ($http, $location, toastr, $compile) {
    var self = this;

    // Object to store my shows
    self.myShows = {};

    // Object to store current show details
    self.currentShow = {
        details: {}
    }

    // List of states for the state dropdown menu
    self.states = {
        list: ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
    };

    self.currentShowYear = 2017;
    self.allShowYears = [];

    // GET My Shows from users_shows table
    self.getShows = function () {
        $http.get('/shows/myShows')
            .then(function (response) {
                self.myShows.data = response.data;
                self.currentShowYear = 2017;

                // Add a fullYear property to each show
                var allShows = self.myShows.data;
                allShows.forEach(function (show) {
                    var date = new Date(show.show_date);
                    var fullYear = date.getFullYear();
                    show.fullYear = fullYear;
                });

                // Add an array of all years in my shows
                allShows.forEach(function (show) {
                    if (!self.allShowYears.includes(show.fullYear)) {
                        // console.log('already there');
                        self.allShowYears.push(show.fullYear);
                    }
                });
                self.allShowYears.sort(function (a, b) { return b - a });
            });
    };

    // Manually add a show
    self.addShow = function (newShow) {
        $http({
            method: 'POST',
            url: '/shows/addShowManually',
            data: newShow
        })
            .then(function (response) {
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


    self.searchShow = function (artist, city, pageNumber) {
        console.log('pageNumber', pageNumber);

        self.searchResultPages = [];
        self.currentPageNumber = pageNumber;
        console.log('currentPageNumber', self.currentPageNumber);

        let searchButton = document.querySelector('#search-button');
        searchButton.classList.add('is-loading');

        $http({
            method: 'GET',
            url: '/shows/searchResults',
            params: {
                artist: artist,
                city: city,
                currentPageNumber: pageNumber
            }
        }).then(
            function (response) {
                self.numberOfSearchPages = Math.ceil(response.data.total / response.data.itemsPerPage);

                for (var i = 0; i < self.numberOfSearchPages; i++) {
                    self.searchResultPages.push(i + 1);
                }

                if (response.data === '') {
                    self.zeroSearchResults = true;
                }
                self.searchShowResults.data = response;
                searchButton.classList.remove('is-loading');
                console.log('search response', response);
            },
            function (data) {
                console.log('this is an error', data.config.params);
            });
    };

    // Add a show from the search results
    self.addSearchedShow = function (artist, mbid, date, venue, city, state, version, sets) {

        // Check to see if the show already has been added
        // self.myShows.data.forEach(function(show){
        //     if(version === show.version_id) {
        //         toastr.warning('You have already added this show.');
        //     }
        // });

        // setlist api date needs to be coverted to proper postgreSQL date format
        let formattedDate = self.toDate(date);

        // Format set data to send to database
        let formattedSets = getSetData(sets);

        $http({
            method: 'GET',
            url: '/shows/artistImage',
            params: {
                artist: artist
            }
        }).then(function (response) {
            let artistMatches = response.data.results.artistmatches.artist;
            let artistImage;

            artistImage = artistMatches.find(function (artist) {
                return artist.mbid == mbid;
            }).image[3]['#text'];

            console.log('artistImage', artistImage);
            $http({
                method: 'POST',
                url: '/shows/addSearchedShow',
                data: {
                    artist: artist,
                    mbid: mbid,
                    show_date: formattedDate,
                    venue: venue,
                    city: city,
                    state: state,
                    version_id: version,
                    setlist: formattedSets,
                    image: artistImage
                }
            }).then(
                function (response) {
                    let showAddedId = response.data[0].id;
                    toastr.success('Show has been added');
                    $location.path('/show/' + showAddedId);
                })
        })
    };

    // DELETE individual show
    self.deleteShow = function (showId) {
        $http({
            url: '/shows/deleteShow',
            method: 'DELETE',
            params: {
                id: showId
            }
        }).then(function (response) {
            console.log('delete response', response.data);
            toastr.success('Show Deleted!');
            self.getShows();
        });
    };

    /*
    ----------------
    HELPER FUNCTIONS
    ----------------
    */

    // Clear search results
    self.clearSearchResults = function () {
        self.searchShowResults = {
            data: []
        };
    }

    // change date format coming back from setlist.fm
    self.toDate = function (dateStr) {
        const [day, month, year] = dateStr.split("-")
        return new Date(year, month - 1, day)
    };

    // Create array of songs from the setlist data object
    function getSetData(sets) {
        let songArray = [];
        sets.forEach(function (set) {
            set.song.forEach(function (song) {
                songArray.push(song.name);
            })
        });
        return songArray;
    }

    // Switch years being shown in the my shows view
    self.changeYear = function(year) {
        self.currentShowYear = year;
    }

}]);