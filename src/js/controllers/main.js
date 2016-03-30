'use strict';

angular.module('fbPagesUiApp.controllers', [])
  .controller('HomeCtrl', ['$scope', 'fbApi', function ($scope, fbApi) {
    $scope.posts  = fbApi.posts.get();
    $scope.page   = fbApi.page.get();

    $scope.orderedPosts = {
        'high': [],
        'low': []
      };
    //sort the posts into priority order... The intent here is to load posts about the business before
    //posts that the business promotes by sharing links, images etc. This can lead to some awareness of the 
    //lack of actual posts by/about the business...
    $scope.posts.$promise.then(function () {
      //reset
      $scope.orderedPosts = {
        'high': [],
        'low': []
      };

      angular.forEach($scope.posts.data, function(post) {
        if (!post.message && !post.name && !post.description) {
          return;
        }
        /*jshint camelcase: false */
        if (post.type === 'status' || post.status_type === 'added_photos' || post.status_type === 'mobile_status_update') {
          this.high.push(post);
        } else {
          this.low.push(post);
        }
      }, $scope.orderedPosts);

    });

    $scope.hasComments = function (post) {
      return (post.comments && post.comments.data.length > 0) || (post.caption && post.caption.length > 0);
    };

    $scope.hasImage = function (post) {
      return ((post.link && post.picture) || post.name || post.description);
    };

  }])

  .controller('PhotoCtrl', ['$scope', 'fbApi', function ($scope, fbApi) {
    $scope.albums = fbApi.albums.get({}, function (albums) {
      var oldestAlbum = 1000 * 60 * 60 * 24 * 365;
      
      var filteredAlbums = [];
      //find the most reciently updated album and show it.
      angular.forEach(albums.data, function (album) {
        if (new Date(album.updated_time).getTime() > Date.now() - oldestAlbum) {
          this.push(album);
        }
      }, filteredAlbums);

      albums.data = filteredAlbums;
      return albums;
    });
  }]);



//         ///////////
//         // Photos //
//         ///////////
//         .state('albums', {
//           url: '/albums',
//           templateUrl: 'views/albums.html',
//           controller: ['$scope', '$stateParams', '$state', 'fbApi',
//             function (  $scope,   $stateParams,   $state,   fbApi) {
              
//               $scope.albums = fbApi.albums.get({}, function (albums) {
//                 var mostRecientlyUpdatedAlbum = { albumId: null, updated: null };

//                 //find the most reciently updated album and show it.
//                 angular.forEach(albums.data, function (album) {
//                   /*jshint camelcase: false */
//                   var updated = new Date(album.updated_time);
//                   if (mostRecientlyUpdatedAlbum.updated === null || mostRecientlyUpdatedAlbum.updated_time < updated) {
//                     mostRecientlyUpdatedAlbum.albumId = album.id;
//                     mostRecientlyUpdatedAlbum.updated = updated;
//                   }
//                 });

//                 if (mostRecientlyUpdatedAlbum.albumId) {
//                   $state.go('albums.detail', { albumId: mostRecientlyUpdatedAlbum.albumId });
//                 }
//               });
//             }
//           ]
//         })

//         .state('albums.detail', {
//           url: '/album/:albumId',
//           views: {
//             'albumPhotos': {
//               templateUrl: 'views/album-details.html',
//               controller: ['$scope', '$stateParams', '$state', 'fbApi',
//                 function (  $scope,   $stateParams,   $state,   fbApi) {
//                   $scope.carouselInterval = 5000;

//                   //caching required to keep the last viewed item when switching between albums
//                   $scope.album = albums[$stateParams.albumId] ? albums[$stateParams.albumId] : fbApi.album.list({ 'albumId': $stateParams.albumId }, (function () {
//                     var albumId = $stateParams.albumId;
//                     return function (album) {
//                       albums[albumId] = album;
//                     };
//                   })());
//                 }
//               ]
//             }
//           }
//         })
