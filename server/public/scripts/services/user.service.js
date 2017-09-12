app.factory('UserService', function($http, $location){

  var userObject = {};

  return {
    userObject : userObject,

    getuser : function(){
      $http.get('/user').then(function(response) {
          if(response.data.email) {            
              // user has a curret session on the server
              userObject.email = response.data.email;
              userObject.first_name = response.data.first_name;
              userObject.last_namep = response.data.last_namep;
          } else {
              // user has no session, bounce them back to the login page
              $location.path("/home");
          }
      },function(response){
        $location.path("/home");
      });
    },

    logout : function() {
      $http.get('/user/logout').then(function(response) {
        $location.path("/home");
      });
    }
  };
});
