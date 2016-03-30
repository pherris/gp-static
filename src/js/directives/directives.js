'use strict';

var directiveModule = angular.module('fbPagesUiApp.directives', []);

directiveModule.directive('fbBackImg', ['$window', '$timeout', function ($window, $timeout) {
  var bgImages,
      element,
      timeout,
      onload=true;

  function setBackgroundImage (elem, imageUrl, width, height) {
    elem.css({
      'background': 'url(' + imageUrl + ') no-repeat center center fixed',
      'background-size': '' + width + 'px ' + height + 'px',
      '-webkit-background-size': 'cover',
      '-moz-background-size': 'cover',
      '-o-background-size': 'cover'
    });
  }

  function findBackground (w, h, backgroundImages) {
    var matchingImage = {};
    //find the image that is just bigger than the current screen width
    angular.forEach(backgroundImages.images, function (image) {
      if (image.height > h && image.width > w) { //the image is big enough
        //if we have no matches, or the current match is bigger than necessary, replace
        if (!this.source || (this.height > image.height && this.width > image.width)) {
          this.height = image.height;
          this.width = image.width;
          this.source = image.source;
        }
      }
    }, matchingImage);
    
    return matchingImage;
  }

  function updateImage () {
    if (timeout) {
      $timeout.cancel(timeout);
    }
    timeout = $timeout(function () {
      var image = findBackground($window.innerWidth, $window.innerHeight, bgImages);
      setBackgroundImage(element, image.source, image.width, image.height);
      timeout = null;
    }, onload ? 0 : 200);

    onload = false;
    
  }

  return {
    link: function (scope, elem, attrs) {
      attrs.$observe('fbBackImg', function (backgroundImages) {
        bgImages = scope.$eval(backgroundImages);
        element = elem;

        if (bgImages && bgImages.images && bgImages.images.length > 0) {
          //array of images loaded... safe to assign
          updateImage();
        }
      });

      var win = angular.element($window);
      win.bind('resize', function () {
        updateImage();
      });
    }
  };
}]);

directiveModule.directive('fbHours', function () {
  return {
    restrict: 'E',
    templateUrl: 'templates/fbHours.html'
  };
});

directiveModule.directive('fbHoursShort', function () {
  return {
    restrict: 'E',
    templateUrl: 'templates/fbHoursShort.html'
  };
});

directiveModule.directive('fbPostComments', function () {
  return {
    restrict: 'E',
    scope: {
      post: '='
    },
    templateUrl: 'templates/fbComments.html'
  };
});

directiveModule.directive('fbPostImage', function () {
  return {
    restrict: 'E',
    scope: {
      post: '='
    },
    templateUrl: 'templates/fbPostImage.html'
  };
});

directiveModule.directive('fbPostHeader', function () {
  return {
    restrict: 'E',
    scope: {
      post: '='
    },
    templateUrl: 'templates/fbPostHeader.html'
  };
});