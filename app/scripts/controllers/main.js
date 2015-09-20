'use strict';

/**
 * @ngdoc function
 * @name maptestAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the maptestAppApp
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
  	/*
  	
  	$scope.createMarker = function(marker){
  		var newMarker = {};

  		newMarker['id'] = marker.id;
      newMarker['type'] = marker.type;
  		newMarker['latitude'] = marker.lat;
  		newMarker['longitude'] = marker.lon;
      newMarker['zIndex'] = 10;

  		if(marker.type === 'LOOP'){
  			newMarker.icon = {
  	        	url: '../../images/shuttleIcons/routeOLoop_30.png',
  	        	anchor: new google.maps.Point(15,15),
  	        	origin: new google.maps.Point(0,0),
  	        };
          }else if(marker.type === 'UPPER CAMPUS'){
          	newMarker.icon = {
              	url: '../../images/shuttleIcons/routeuc_30.png',
              	anchor: new google.maps.Point(15,15),
              	origin: new google.maps.Point(0,0),
              };
         	} else if(marker.type === 'NIGHT OWL'){
          	newMarker.icon = {
              	url: '../../images/shuttleIcons/routeno_30.png',
              	anchor: new google.maps.Point(15,15),
              	origin: new google.maps.Point(0,0),
              };
         	} else if(marker.type === 'LOOP OUT OF SERVICE AT BARN THEATER' || marker.type === 'OUT OF SERVICE/SORRY'){
              newMarker.icon = {
                url: '../../images/shuttleIcons/routeos_30.png',
                anchor: new google.maps.Point(15,15),
                origin: new google.maps.Point(0,0),
              };

         }else{
          	newMarker.icon = {
              	url: '../../images/shuttleIcons/routeOLoop_30.png',
              	anchor: new google.maps.Point(15,15),
              	origin: new google.maps.Point(0,0),
              };
  		}

  		return newMarker;
  	};
  	
  	$scope.updateMarker = function(original, newBus){
  		original.latitude = newBus.lat;
  		original.longitude = newBus.lon;
  		return original;
  	};
    */
  	
	
});
