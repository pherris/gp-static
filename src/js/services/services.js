'use strict';

var serviceModule = angular.module('fbPagesUiApp.services', ['ngResource', 'config']);

serviceModule.factory('fbApi', ['$resource', 'ENV', function ($resource, ENV ) {
  return {
    posts:   $resource(ENV.apiEndpoint + '/fb/posts'),
    post:    $resource(ENV.apiEndpoint + '/fb/:postId'),
    image:   $resource(ENV.apiEndpoint + '/fb/:imageId'),
    page:    $resource(ENV.apiEndpoint + '/fb/'),
    photos:  $resource(ENV.apiEndpoint + '/fb/photos/uploaded'),
    albums:  $resource(ENV.apiEndpoint + '/fb/albums'),
    album:   $resource(ENV.apiEndpoint + '/fb/:albumId/photos', {}, {
      list : {
        method : 'GET',
        cache : true
      }
    })
  };
}]);
 
serviceModule.factory('appApi', ['$resource', 'ENV', function ($resource, ENV) {
  return {
    config:  $resource(ENV.apiEndpoint + '/config')
  };
}]);