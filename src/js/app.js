/* global google */
'use strict';

var app = angular.module('fbPagesUiApp', [
  'fbPagesUiLoader',
  'ngResource',
  'fbPagesUiApp.services',
  'config',
  'fbPagesUiApp.directives',
  'fbPagesUiApp.controllers',
  'ui.router',
  'ui.bootstrap'
]);

// app.run([  '$rootScope', '$state', '$stateParams', '$window',
//   function ($rootScope,   $state,   $stateParams,   $window) {

//   // It's very handy to add references to $state and $stateParams to the $rootScope
//   // so that you can access them from any scope within your applications.For example,
//   // <li ui-sref-active="active }"> will set the <li> // to active whenever
//   // 'contacts.list' or one of its decendents is active.
//   $rootScope.$state = $state;
//   $rootScope.$stateParams = $stateParams;

//   //make window available on root scope
//   $rootScope.window = $window;
// }]);

// app.config(
//   [          '$stateProvider',
//     function ($stateProvider) {
//       var albums = {}; //local cache
//       /////////////////////////////
//       // Redirects and Otherwise //
//       /////////////////////////////



//       //////////////////////////
//       // State Configurations //
//       //////////////////////////

//       // Use $stateProvider to configure your states.
//       $stateProvider

//         //////////
//         // Home //
//         //////////

//         .state('home', {

//           // Use a url of "/" to set a states as the "index".
//           url: '/',
//           controller: 'MainCtrl'

//         })

//         ///////////
//         // FB Deep Link //
//         ///////////
//         .state('post', {
//           url: '/post/:pageId',
//           templateUrl: 'views/post.html',
//           controller: ['$scope', '$stateParams', '$state', 'fbApi', 'appApi',
//             function (  $scope,   $stateParams,   $state,   fbApi,   appApi) {
//               $scope.post = fbApi.post.get({ 'postId': $stateParams.pageId });
//               $scope.preferences = {};

//               //get the configuration object for this post (if any)
//               //TODO consider moving this into a service to be called also from the loader.js to send more specific data to google analytics
//               var config = appApi.config.get({}, function () {
//                 angular.forEach(config.facebook.pages, function (value) {
//                   if (value.postId === $stateParams.pageId) {
//                     this.post = value.displayPreferences.post;
//                   }
//                 }, $scope.preferences);
//               });
//             }
//           ]
//         })

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

//         //////////////
//         // Services //
//         //////////////

//         .state('services', {
//             url: '/services',
//             templateUrl: 'views/services.html'
//           }
//         )

//         ///////////
//         // Bikes //
//         ///////////

//         .state('bikes', {
//             url: '/bikes',
//             templateUrl: 'views/bikes.html'
//           }
//         )


//         ///////////
//         // Routes //
//         ///////////

//         .state('routes', {
//             url: '/routes',
//             templateUrl: 'views/routes.html'
//           }
//         )

//         ///////////
//         // Contact //
//         ///////////

//         .state('contact', {
//             url: '/contact',
//             templateUrl: 'views/contact.html',
//             controller: ['$q', '$window', function ($q, $window) {
//               var deferred = $q.defer();

//               if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
//                 $window.googleMapsInitialized = deferred.resolve;

//                 var script  = document.createElement('script');
//                 script.type = 'text/javascript';
//                 script.src  = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
//                     'callback=googleMapsInitialized';
//                 document.body.appendChild(script);
//               } 

//               deferred.promise.then(function() {
//                 var position = new google.maps.LatLng(44.939914, -93.182111);
//                 var myOptions = {
//                   zoom: 14,
//                   center: position,
//                   mapTypeId: google.maps.MapTypeId.ROADMAP
//                 };
//                 var map = new google.maps.Map(
//                   document.getElementById('map_canvas'),
//                   myOptions);

//                 var marker = new google.maps.Marker({
//                   position: position,
//                   map: map,
//                   title: 'Grand Performance'
//                 });

//                 var contentString = '<strong>Grand Performance</strong><br/>1938 Grand Ave · Saint Paul · MN · 55105 <br/><a href="mailto:info@gpbicycles.com">info@gpbicycles.com</a> · (651) 699-2640';
//                 var infowindow = new google.maps.InfoWindow({
//                   content: contentString
//                 });

//                 google.maps.event.addListener(marker, 'click', function() {
//                   infowindow.open(map,marker);
//                 });
//               });
//             }]
//           }
//         );
//     }
//   ]
// );