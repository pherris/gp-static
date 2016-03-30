/*global ga:false */
'use strict';

//Isolate code for loading odd/hard to test libraries.
var loader = angular.module('fbPagesUiLoader', []);

//load facebook with configured appId
loader.run([  '$log', 'appApi',
  function ($log,      appApi) {
    if (window.innerWidth >= 480) {
      try {
        var config = appApi.config.get(function () {
          (function(d, s, id, appId) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
              return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = '//connect.facebook.net/en_US/all.js#xfbml=1&appId=' + appId;
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk', config.facebook.appId));
        });
      } catch (e) {
        $log.warn('Facebook loaded, but not properly...');
      }
    }
  }]);

