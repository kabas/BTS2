'use strict';

/**
 * @ngdoc function
 * @name maptestAppApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the App
 */
angular.module('BTS2App')
  .controller('MapCtrl', function ($rootScope, $scope, $http, $timeout,
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
				$scope.showMobileApp();	
				$scope.copyright = 'copyrightMobile';
			}
	    }, function() {
	    	//nothing
	    });
	};
	
	$scope.showTestDialog();

});


