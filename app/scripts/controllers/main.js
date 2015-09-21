/*
The MIT License (MIT)

Copyright (c) 2015 Kevin Abas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/  

'use strict';

/**
 * @ngdoc function
 * @name BTS2App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller for global information
 */
angular.module('BTS2App')
  .controller('MainCtrl', function ($scope) {
  	
  	$scope.createMarker = function(marker){
  		var newMarker = {};

  		newMarker.id = marker.id;
  		newMarker.latitude = marker.latitude;
      newMarker.route = marker.route;
  		newMarker.longitude = marker.longitude;
      newMarker.zIndex = 10;

		if(marker.route === 'LOOP'){
      //Find out if Inner or Outer Loop
      var stopPredictionSlope = 0;
      var prevP, currP;
      marker.predictions = marker.predictions.split(',');
      prevP = -1;
      for(var s=marker.predictions.length-1; s >= 0; s--){
        if(marker.predictions[s]){
          currP = marker.predictions[s];
          if(currP < prevP){
            stopPredictionSlope++;
          }
          if(stopPredictionSlope > 3) {
              newMarker.icon = {
                url: '../../images/shuttleIcons/routeILoop_30.png',
                anchor: new google.maps.Point(15,15),
                origin: new google.maps.Point(0,0),
              };
              newMarker.route = 'INNER LOOP';
              return newMarker;
          }
          prevP = currP;
        }
      }
      newMarker.icon = {
        url: '../../images/shuttleIcons/routeOLoop_30.png',
        anchor: new google.maps.Point(15,15),
        origin: new google.maps.Point(0,0),
      };
      newMarker.route = 'OUTER LOOP';
    }else if(marker.route === 'UPPER CAMPUS'){
      newMarker.icon = {
        url: '../../images/shuttleIcons/routeuc_30.png',
        anchor: new google.maps.Point(15,15),
        origin: new google.maps.Point(0,0),
      };
    } else if(marker.route === 'NIGHT OWL'){
      newMarker.icon = {
        url: '../../images/shuttleIcons/routeno_30.png',
        anchor: new google.maps.Point(15,15),
        origin: new google.maps.Point(0,0),
      };
    } else if(marker.route === 'LOOP OUT OF SERVICE AT BARN THEATER' || marker.route === 'OUT OF SERVICE/SORRY'){
      newMarker.icon = {
        url: '../../images/shuttleIcons/routeos_30.png',
        anchor: new google.maps.Point(15,15),
        origin: new google.maps.Point(0,0),
      };

    }else{
            newMarker.icon = {
                url: '../../images/shuttleIcons/routesp_30.png',
                anchor: new google.maps.Point(15,15),
                origin: new google.maps.Point(0,0),
              };
      }

  		return newMarker;
  	};

  	$scope.updateMarker = function(original, newBus){
  		original.latitude = newBus.latitude;
  		original.longitude = newBus.longitude;
  		return original;
  	};
  	
    $scope.updateIOSScreenSize = function(){
      if (
            navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i) && 
            window.innerHeight != document.documentElement.clientHeight
        ) {
            var fixViewportHeight = function() {
                document.documentElement.style.height = window.innerHeight + "px";
                if (document.body.scrollTop !== 0) {
                    window.scrollTo(0, 0);
                }
            };

            window.addEventListener("scroll", fixViewportHeight, false);
            window.addEventListener("orientationchange", fixViewportHeight, false);
            fixViewportHeight();

            document.body.style.webkitTransform = "translate3d(0,0,0)";
        }
       if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i)) {
            $('html').addClass('ipad ios7');
        } 
    };
  	
	
});
