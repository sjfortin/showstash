app.service('ArtistImageService', ['$http', function ($http) {
    var self = this;

    // stores images of artists the user has under their my shows
    self.artistImages = {
        list: []
    }

    // GET artist images
    self.getArtistImages = function () {
        $http({
            url: '/shows/artistImages',
            method: 'GET',
        }).then(function (response) {
            self.artistImages.list = response.data;
            self.artistImages.list = self.artistImages.list.filter(function (image) {
                return image.image != '' && image.image != 'https://i.pinimg.com/originals/9d/23/17/9d2317310b456185ed9663d3d7b87490.jpg';
            });
        });
    };

    // run getArtistImages on service load
    self.getArtistImages();

}]);