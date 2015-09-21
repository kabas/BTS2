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
 * @ngdoc overview
 * @name BTS2App
 * @description
 * # BTS2App angular module
 *
 * Main module of the application.
 */
var btsModule = angular
  .module('BTS2App', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'uiGmapgoogle-maps',
    'ngMaterial',
    'ngMdIcons'
  ])
  .config(["$routeProvider", "$locationProvider", function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    
    $locationProvider.html5Mode(true);
  }]);

  btsModule.config(["uiGmapGoogleMapApiProvider", function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyDartvWxBRwtQW213XfzXBPSuBn-vn-c1E',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
  }]);

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
  .controller('MainCtrl', ["$scope", function ($scope) {
  	
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
  	
	
}]);

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
 * @name BTS2App.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of The google maps element
 */
angular.module('BTS2App')
  .controller('MapCtrl', ["$rootScope", "$scope", "$http", "$timeout", "$window", "$log", "uiGmapGoogleMapApi", "$mdDialog", "$mdSidenav", function ($rootScope, $scope, $http, $timeout,
  										$window, $log, uiGmapGoogleMapApi, $mdDialog, $mdSidenav) {
    var timeoutID = []; // Identifier for Data retrieval timer, can be used to stop.
    $scope.animateTimeout = 0;
    $rootScope.busCount = 0;
    $rootScope.noBusMessage = false;
    $scope.returnToTab = false;

    //Check if browser is mobile size
    $rootScope.notMobile = ($window.innerWidth > 1024)? true : false;

    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
        });
      $rootScope.toggleLeftButton();
      $rootScope.showPanel = false;
    };

    $scope.openNav = function () {
      $mdSidenav('left').open()
        .then(function () {
        });
        $rootScope.showPanel = true;
        $rootScope.toggleLeftButton();
    };

    //ios VS Android compatibility
    function detectBrowser() {
	  var useragent = navigator.userAgent;
	  var mapdiv = document.getElementById('mapContainer');

	  if (useragent.indexOf('iPhone') !== -1 || useragent.indexOf('Android') !== -1 ) {
	    mapdiv.style.width = '100%';
	    mapdiv.style.height = '100%';
	    $rootScope.notMobile = true;
	  } else {
	  	$rootScope.notMobile = false;
	  }
	}

    /* Some google map properties need to be predefined before being loaded */
    $scope.map = {  id: 1,
    				center : {latitude: 36.990282103105066,
        			longitude: -122.06149578094482}, 
        			markers:[],
        			busInnerStops:[],
        			busOuterStops:[],
        			busStops:[],
        			zoom: $rootScope.notMobile ? 15 : 14,
        			options:{
        				streetViewControl: true,
					    streetViewControlOptions: {
					        position: 7
					    },
			        	panControl: true,
						panControlOptions: {
						    position: 7
						},
			        	zoomControl: true,
			  			zoomControlOptions: {
			    			style: 2,
			    			position: 7
			  			},
			  			scaleControl: true,
					    scaleControlOptions: {
					        position: 7
					    }
					    
			      	},
			      	events: {}
        		};
    $scope.markerIDs = [];

    // uiGmapGoogleMapApi is a promise.
    // The 'then' callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {
    	$scope.maps = maps;
    	fillStops();
    	getData();
    	
    });

  	var updateBusMarkers = function(){
		for(var i = 0; i< $scope.map.markers.length;i++){

                //note: predicition array indexes match stop IDs
				$scope.map.markers[i].predictionArray = $scope.map.markers[i].predictions.split(',');

                //Determine which LOOP direction
                if( $scope.map.markers[i].route === 'LOOP' ){
                    if($scope.map.markers[i].predictionArray[1] < $scope.map.markers[i].predictionArray[2] ||
                       $scope.map.markers[i].predictionArray[4] < $scope.map.markers[i].predictionArray[5] ||
                       $scope.map.markers[i].predictionArray[9] < $scope.map.markers[i].predictionArray[12] ||
                       $scope.map.markers[i].predictionArray[14] < $scope.map.markers[i].predictionArray[16] ||
                       $scope.map.markers[i].predictionArray[17] < $scope.map.markers[i].predictionArray[19] ||
                       $scope.map.markers[i].predictionArray[22] < $scope.map.markers[i].predictionArray[25] ||
                       $scope.map.markers[i].predictionArray[28] < $scope.map.markers[i].predictionArray[1]){
                           $scope.map.markers[i].route =  'ILoop';
                    }else{
                           $scope.map.markers[i].route = 'OLoop';
                    }
                } else if( $scope.map.markers[i].route === 'UPPER CAMPUS' ){
                	$scope.map.markers[i].route = 'uc';
                } else {
                	continue;
                }

                $scope.map.markers[i].icon = {
                	url: '../../images/shuttleIcons/route' + $scope.map.markers[i].route + '_30.png',
                	anchor: new google.maps.Point(15,15),
                	origin: new google.maps.Point(0,0),
                };


              
		}
		 _.each($scope.map.markers, function (marker) {
		    marker.closeClick = function () {
		       // marker.showWindow = false;
		        _.defer(function(){$scope.$apply();});
		    };
		    marker.onClicked = function () {
		        //onMarkerClicked(marker);
		    };
		});

	};

    /* Bus Data Retrieval*/
    var getData = function() {

    	/*******  animation code *************/
    	// adopted from : http://jsfiddle.net/rcravens/RFHKd/13/
    	var animateBus = function(originalBusIndex, newBusLocation){
		    var deltaLat, deltaLng;
    		var AnimationOccured = 0;
    		var numDeltas = 100;
		    var delay = 5; //milliseconds
		    var frame = 0;
			
    		var moveMarker = function (){
    			if($scope.map.markers.length === 0){
    				return;
    			}
		        $scope.map.markers[originalBusIndex].latitude += deltaLat;
		        $scope.map.markers[originalBusIndex].longitude += deltaLng;

		        //update fast but asyncronously so to not colide with other updates
		        _.defer(function(){$scope.$apply();});
		        if(frame!==numDeltas){
		            frame++;
		            $scope.animateTimeout = setTimeout(moveMarker, delay);
		        }else{
		        	return;
		        }
		    };

			if(($scope.map.markers[originalBusIndex].latitude !==newBusLocation.latitude) || 
					($scope.map.markers[originalBusIndex].longitude !==newBusLocation.longitude)){
				deltaLat = ( newBusLocation.latitude - $scope.map.markers[originalBusIndex].latitude)/numDeltas;
		        deltaLng = ( newBusLocation.longitude - $scope.map.markers[originalBusIndex].longitude)/numDeltas;
		       	if((deltaLat!==0) &&(deltaLng!==0)){
		       		moveMarker();
		       	}
				AnimationOccured = 1;
			}else{
				return;
			}
				
		};
	    /***************************************/

	    /*Currently using JSONP to prevent Cross origin issues*/
	   $.ajax({
   		url: 'http://skynet.soe.ucsc.edu/bts/coord2.jsonp',
    	dataType: 'jsonp',
    	jsonp : true,
    	cache: false,
    	jsonpCallback: 'parseResponse',
    	success: function(data) {
        console.log(data);
   
	    		$rootScope.busCount = data.count;
	      		if($rootScope.busCount === 0 && (!$scope.noBusMessage)){
	  				$scope.showNoBuses();
	  			}

	  			//Add new markers if needed
	  			var add;
	  			for (var j = data.count - 1; j >= 0; j--) {
	  				add = true;
	  				for (var z = $scope.markerIDs.length - 1; z >= 0; z--) {
	  					if ( $scope.markerIDs[z] === data.markers[j].id ){
	      					add = false;
	      				}
	  				};
	  				if ( add ){
	  					$scope.map.markers.push($scope.createMarker(data.markers[j]));
	  					$scope.markerIDs.push(data.markers[j].id);
	  				}
	  			};
	  			//sanitize marker array for old markers
	  			var remove;
	  			for (var k = $scope.map.markers.length - 1; k >= 0; k--) {
	  				remove = true;
	  				for (var l = data.count - 1; l >= 0; l--) {
	  					if($scope.map.markers[k].id === data.markers[l].id){
	  						remove = false;
	  					}
	  				};
	  				if(remove === true){
	  					for (var f = $scope.markerIDs.length - 1; f >= 0; f--) {
								if($scope.markerIDs[f] === $scope.map.markers[k].id){
									$scope.markerIDs.splice(f,1);
								}
	  					}
	  					$scope.map.markers.splice(k,1);
	  				}
	  			};

      			//animate marker updates
	  			for (var d = $scope.map.markers.length - 1; d >= 0; d--) {
	  				for (var e = data.count - 1; e >= 0; e--) {
	  					if($scope.map.markers[d].id === data.markers[e].id){
	  						if($rootScope.notMobile){
	  						animateBus(d,data.markers[e]);
	  						}else{
	  							$scope.map.markers[d].latitude = data.markers[e].latitude;
	  							$scope.map.markers[d].longitude = data.markers[e].longitude;
	  						}
	  					}
	  				};
	  			};

      			_.each($scope.map.markers, function (marker) {
				    marker.closeClick = function () {
				       // marker.showWindow = false;
				        _.defer(function(){$scope.$apply();});
				    };
				    marker.onClicked = function () {
				       $scope.map.center = {latitude: marker.latitude,
		        			longitude: marker.longitude};
				       onClickedBus(marker);
				       
				    };
				});

				timeoutID.push($timeout(getData, 3000));

	      		$window.onblur = function () {
	      			for (var i = timeoutID.length - 1; i >= 0; i--) {
	      				$timeout.cancel(timeoutID[i]);
	      			};
	      			timeoutID.splice(0,timeoutID.length);
					//$timeout.cancel(timeoutID);
					$timeout.cancel($scope.animateTimeout);
					$scope.map.markers.splice(0,$scope.map.markers.length);
					$scope.markerIDs.splice(0,$scope.markerIDs.length);
					
				};
				$window.onfocus = function () {
					//Restart data refresh requests
					getData();
				}; 

			} 
		});		

	};

	var onClickedBus = function( bus ){
			$scope.currBus = bus.route;
			$scope.showRoute();
	}; 

	/*
	 * Stops are static and therefor don't need to be retrieved from the server, so
	 * they are statically defined here. May move them to a utility file later :) 
	 */
	var fillStops = function() {

		var InnerLoopstopData = [
									 [5, 36.9999313354492, -122.062049865723, 'McLaughlin & Science Hill'],
									 [2, 36.9967041015625, -122.063583374023, 'Heller & Kerr Hall'],
									 [3, 36.999210357666, -122.064338684082, 'Heller & Kresge College'],
									 [5, 36.9999313354492, -122.062049865723, 'McLaughlin & Science Hill'],
								 	 [6, 36.9997062683105, -122.05834197998, 'McLaughlin & College 9 & 10 - Health Center'],
								 	 [10, 36.9966621398926, -122.055480957031, 'Hagar & Bookstore'],
									 [13, 36.9912567138672, -122.054962158203, 'Hagar & East Remote'],
									 [15, 36.985523223877, -122.053588867188, 'Hagar & Lower Quarry Rd'],
									 [17, 36.9815368652344, -122.052131652832, 'Coolidge & Hagar'],
									 [18, 36.9787902832031, -122.057762145996, 'High & Western Dr'],
									 [20, 36.9773025512695, -122.054328918457, 'High & Barn Theater'],
									 [23, 36.9826698303223, -122.062492370605, 'Empire Grade & Arboretum'],
									 [26, 36.9905776977539, -122.066116333008, 'Heller & Oakes College'],
									 [29, 36.9927787780762, -122.064880371094, 'Heller & College 8 & Porter']
								];

		for (var i = InnerLoopstopData.length - 1; i >= 0; i--) {
			$scope.map.
				busInnerStops.push({
									id : InnerLoopstopData[i][0],
									loopType: 'Inner',
									icon: {
										url: '../../images/InnerLoopStop_small.png',
        								anchor: new google.maps.Point(5,5),
        								origin: new google.maps.Point(0,0),
									},
									latitude: InnerLoopstopData[i][1],
									longitude: InnerLoopstopData[i][2],
									showWindow: false,
									stopName: InnerLoopstopData[i][3]
								  });
		};
		_.each($scope.map.busInnerStops, function (marker) {
		    marker.closeClick = function () {
		       marker.showWindow = false;
		        _.defer(function(){$scope.$apply();});
		    };
		    marker.onClicked = function () {
		        onclickedStop(marker);
		    };
		});
		var OuterLoopstopData = [
									[1, 36.9992790222168, -122.064552307129, 'Heller & Kresge College'],
									[4, 37.0000228881836, -122.062339782715, 'McLaughlin & Science Hill'],
									[7, 36.9999389648438, -122.058349609375, 'McLaughlin & College 9 & 10 - Health Center'],
									[8, 36.9990234375, -122.055229187012, 'McLaughlin & Crown College'],
									[9, 36.9974822998047, -122.055030822754, 'Hagar & Bookstore-Stevenson College'],
									[11, 36.9942474365234, -122.055511474609, 'Hagar & Field House East'],
									[12, 36.9912986755371, -122.054656982422, 'Hagar & East Remote'],
									[14, 36.985912322998, -122.053520202637, 'Hagar & Lower Quarry Rd'],
									[16, 36.9813537597656, -122.051971435547, 'Coolidge & Hagar'],
									[19, 36.9776763916016, -122.053558349609, 'Coolidge & Main Entrance'],
									[21, 36.9786148071289, -122.05785369873, 'High & Western Dr'],
									[22, 36.9798469543457, -122.059257507324, 'Empire Grade & Tosca Terrace'],
									[24, 36.9836616516113, -122.064964294434, 'Empire Grade & Arboretum'],
									[25, 36.989917755127, -122.067230224609, 'Heller & Oakes College'],
									[27, 36.991828918457, -122.066833496094, 'Heller & Family Student Housing'],
									[28, 36.992977142334, -122.065223693848, 'Heller & College 8 & Porter']
								];

		for (var i = OuterLoopstopData.length - 1; i >= 0; i--) {
			var stop = OuterLoopstopData[i][3];
			$scope.map.
				busOuterStops.push({
									id : OuterLoopstopData[i][0],
									loopType: 'Outer',
									icon: {
										url: '../../images/OuterLoopStop_small.png',
        								anchor: new google.maps.Point(5,5),
        								origin: new google.maps.Point(0,0),
									},
									zIndex: 3,
									latitude: OuterLoopstopData[i][1],
									longitude: OuterLoopstopData[i][2],
									showWindow: false,
									stopName: OuterLoopstopData[i][3]
								  });
		};
		_.each($scope.map.busOuterStops, function (marker) {
		    marker.closeClick = function () {
		       marker.showWindow = false;
		        _.defer(function(){$scope.$apply();});
		    };
		    marker.onClicked = function () {
		        onclickedStop(marker);
		    };
		});

		
	};
	

	var onclickedStop = function( stop ){
			$scope.currentStopName = stop.stopName;
			$scope.currentStopId = stop.id;
			$scope.currentStopType = stop.loopType;
			$scope.showStop();
		};
	var closeStopDialog = function( stop ){
			alert(stop);
		};
	$scope.showStop = function($event) {
	    	
		    $mdDialog.show({
		      clickOutsideToClose: true,
		      controller: DialogController,
		      templateUrl: '../../views/stopDialog.html',
		      targetEvent: $event,
		      locals: { stop: $scope.currentStopName, id:$scope.currentStopId, type:$scope.currentStopType, map:$scope.map, maps:$scope.maps, marker:$scope.currBus}
		    })
		    .then(function() {
		      //nothing
		    }, function() {
		      //nothing
		    });

		 
	};
	$scope.showNoBuses = function($event) {
		$scope.noBusMessage = true;
	    $mdDialog.show({
	      clickOutsideToClose: true,
	      controller: DialogController,
	      templateUrl: '../../views/nobusDialog.html',
	      targetEvent: $event,
	      locals: { stop: $scope.currentStopName, id:$scope.currentStopId, type:$scope.currentStopType, map:$scope.map, maps:$scope.maps, marker:$scope.currBus}
	    })
	    .then(function() {
	      //nothing
	    }, function() {
	      //nothing
	    });
	};

	$scope.showMobileApp = function($event) {
	    $mdDialog.show({
	      clickOutsideToClose: true,
	      controller: ['$scope','$mdDialog', DialogController],
	      templateUrl: '../../views/mobileDialog.html',
	      targetEvent: $event,
	      locals: { stop: $scope.currentStopName, id:$scope.currentStopId, type:$scope.currentStopType, map:$scope.map, maps:$scope.maps, marker:$scope.currBus}
	    })
	    .then(function(answer) {
	    	//nothing
	    }, function() {
	    	//nothing
	    });
	};

	$scope.showRoute = function($event) {
	    $mdDialog.show({
	      clickOutsideToClose: true,
	      controller:  DialogController,
	      templateUrl: '../../views/routeDialog.html',
	      targetEvent: $event,
	      locals: { stop: $scope.currentStopName, id:$scope.currentStopId, type:$scope.currentStopType, map:$scope.map, maps:$scope.maps, marker:$scope.currBus}
	    })
	    .then(function(answer) {
	    	//nothing
	    }, function() {
	    	//nothing
	    });
	};

	
	$scope.showTestDialog = function($event) {
	    $mdDialog.show({
	      clickOutsideToClose: true,
	      controller: DialogController,
	      templateUrl: '../../views/testDialog.html',
	      targetEvent: $event,
	      locals: { stop: $scope.currentStopName, id:$scope.currentStopId, type:$scope.currentStopType, map:$scope.map, maps:$scope.maps, marker:$scope.currBus}
	    })
	    .then(function(answer) {
    		if(!$rootScope.notMobile){
    			$scope.updateIOSScreenSize();
				//$scope.showMobileApp();	
				$scope.copyright = 'copyrightMobile';
			}
	    }, function() {
	    	//nothing
	    });
	};
	
	$scope.showTestDialog();

}]);



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
 * @name BTS2App.controller:PanelCtrl
 * @description
 * # PanelCtrl
 * Controller of the Side Panel
 */
angular.module('BTS2App')
  .controller('PanelCtrl', ["$rootScope", "$scope", "$timeout", "$mdSidenav", "$mdUtil", function ($rootScope, $scope, $timeout, $mdSidenav, $mdUtil) {
 	//$scope.toggleLeft = buildToggler('left');
 	//$rootScope.toggleLeftButton = buildToggler('navButton');
 	$rootScope.showPanel = true;
 	$scope.toggleLeft();
 	$scope.oneAtATime = true;
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navID)
              .toggle()
              .then(function () {
              });
          },300);
      $rootScope.showPanel = !($scope.showPanel);
      return debounceFn;
    }

    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
        });
        $rootScope.showPanel = false;
        if(!$mdSidenav('navButton').isOpen()){
        	$rootScope.toggleLeftButton();
        }
    };
	
}]);
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
 * @name BTS2App.controller:MapCtrl
 * @description
 * # DialogCtrl
 * Controller for marker dialogs
 */

function DialogController($scope, $mdDialog, stop, id, type, map, maps, route) {
	$scope.currentStopName = stop;
	$scope.currentStopType = type;
	if(route){
		$scope.Route = route;
		if(route === 'OUTER LOOP'){
			$scope.routeColor = '#03A9F4';
		}else if(route === 'INNER LOOP') {
			$scope.routeColor = '#e8721f';
	    }else if(route === 'UPPER CAMPUS'){
	    	$scope.routeColor = '#FFEB3B';
	   	} else if(route === 'NIGHT OWL'){
	    	$scope.routeColor = '#009688';
	   	} else if(route === 'LOOP OUT OF SERVICE AT BARN THEATER' || route === 'OUT OF SERVICE/SORRY'){
	        $scope.routeColor = '#F44336';
	   	}else{
	    	$scope.routeColor = '#607D8B';
		}
	}
	$scope.photo = 'images/stopPhotos/' + type + stop + '/' + id + '.jpg';
	$scope.stopPreview = {'background':'url('+$scope.photo+')'};
	$scope.hide = function() {
	$mdDialog.hide();
	};

	$scope.showStreetView = function(){
		var streetViewData = {
			'OuterMcLaughlin & Science Hill':{lat:36.999935,lng:-122.062135,head:296.89,pitch:0},
			'OuterHeller & Kresge College':{lat:36.999241,lng:-122.064452,head:270.54,pitch:-10},
			'OuterMcLaughlin & College 9 & 10 - Health Center':{lat:36.999856,lng:-122.058251,head:339.05,pitch:5},
			'OuterMcLaughlin & Crown College':{lat:36.998954,lng:-122.055286,head:40.62,pitch:-5},
			'OuterHagar & Bookstore-Stevenson College':{lat:36.997219,lng:-122.055263,head:57.52,pitch:5},
			'OuterHagar & Field House East':{lat:36.994269,lng:-122.055624,head:69.66,pitch:-5},
			'OuterHagar & East Remote':{lat:36.991304,lng:-122.054784,head:92.8,pitch:-5},
			'OuterHagar & Lower Quarry Rd':{lat:36.985984,lng:-122.053706,head:101.89,pitch:0},
			'OuterCoolidge & Hagar':{lat:36.981484,lng:-122.051999,head:180.41,pitch:-5},
			'OuterCoolidge & Main Entrance':{lat:36.977468,lng:-122.053582,head:28.03,pitch:-5},
			'OuterHigh & Western Dr':{lat:36.978694,lng:-122.057741,head:259.02,pitch:-5},
			'OuterEmpire Grade & Tosca Terrace':{lat:36.97984,lng:-122.059084,head:209.46,pitch:-5},
			'OuterEmpire Grade & Arboretum':{lat:36.983755,lng:-122.064933,head:181.41,pitch:0},
			'OuterHeller & Oakes College':{lat:36.989899,lng:-122.067078,head:282.16,pitch:-5},
			'OuterHeller & Family Student Housing':{lat:36.991905,lng:-122.066699,head:216.25,pitch:5},
			'OuterHeller & College 8 & Porter':{lat:36.992896,lng:-122.065127,head:349.44,pitch:5},
			'InnerHeller & Kerr Hall':{lat:36.996805,lng:-122.063655,head:40.17,pitch:-5},
			'InnerHeller & Kresge College':{lat:36.99911,lng:-122.064476,head:84.33,pitch:-10},
			'InnerMcLaughlin & Science Hill':{lat:36.999935,lng:-122.062135,head:142.31,pitch:-10},
			'InnerMcLaughlin & College 9 & 10 - Health Center':{lat:36.999845,lng:-122.05824,head:181.55,pitch:-5},
			'InnerHagar & Bookstore':{lat:36.996823,lng:-122.055366,head:212.14,pitch:-10},
			'InnerHagar & East Remote':{lat:36.991469,lng:-122.054875,head:201.42,pitch:-10},
			'InnerHagar & Lower Quarry Rd':{lat:36.985671,lng:-122.053489,head:203.61,pitch:-5},
			'InnerCoolidge & Hagar':{lat:36.981457,lng:-122.052044,head:334.96,pitch:5},
			'InnerHigh & Western Dr':{lat:36.978641,lng:-122.057663,head:5.51,pitch:-5},
			'InnerHigh & Barn Theater':{lat:36.977237,lng:-122.054173,head:321.62,pitch:-5},
			'InnerEmpire Grade & Arboretum':{lat:36.982496,lng:-122.062425,head:351.79,pitch:-5},
			'InnerHeller & Oakes College':{lat:36.99052,lng:-122.066254,head:78.52,pitch:5},
			'InnerHeller & College 8 & Porter':{lat:36.992894,lng:-122.064712,head:217.81,pitch:-5}
		};
		$scope.hide();
		$scope.sv = new google.maps.StreetViewPanorama(document.getElementById('map'),{
			//navigationControl: false,
			addressControlOptions:{
									position: 7
			},
			enableCloseButton: true,
			panControlOptions:{
								position : 7,
			},
			zoomControl: false,
			linksControl: false,
			position: new google.maps.LatLng(streetViewData[$scope.currentStopType+$scope.currentStopName].lat,
												 streetViewData[$scope.currentStopType+$scope.currentStopName].lng),
			pov: {
				heading: streetViewData[($scope.currentStopType+$scope.currentStopName)].head,
			pitch: streetViewData[($scope.currentStopType+$scope.currentStopName)].pitch
			},
			visible: true
		});
	}; 	

}
DialogController.$inject = ['$scope', '$mdDialog', 'stop', 'id', 'type', 'map', 'maps', 'marker'];
angular.module('BTS2App')
	.controller( 'DialogController', [ '$scope', '$mdDialog', 'stop', 'id', 'type', 'map', 'maps', 'marker', DialogController ] );