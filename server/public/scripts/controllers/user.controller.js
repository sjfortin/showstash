app.controller('UserController', ['UserService', 'ArtistImageService', function (UserService, ArtistImageService) {
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  vm.ArtistImageService = ArtistImageService;
  vm.artistImages = ArtistImageService.artistImages;

}]);
