myApp.factory('UserService', function($http, $location){
  console.log('UserService Loaded');

  var userObject = {};

  return {
    userObject : userObject,

    getuser : function(){
      console.log('UserService -- getuser');
      $http.get('/user').then(function(response) {
          if(response.data.email) {
              // user has a curret session on the server
              userObject.email = response.data.email;
              console.log('UserService -- getuser -- User Data: ', userObject.email);
          } else {
              console.log('UserService -- getuser -- failure');
              // user has no session, bounce them back to the login page
              $location.path("/home");
          }
      },function(response){
        console.log('UserService -- getuser -- failure: ', response);
        $location.path("/home");
      });
    },

    logout : function() {
      console.log('UserService -- logout');
      $http.get('/user/logout').then(function(response) {
        console.log('UserService -- logout -- logged out');
        $location.path("/home");
      });
    }
  };
});
