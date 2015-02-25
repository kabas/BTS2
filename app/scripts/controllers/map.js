
/**
 * @ngdoc function
 * @name maptestAppApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the maptestAppApp
 */
angular.module('maptestAppApp')
  .controller('MapCtrl', function ($scope, $http, $timeout, $window, $log, uiGmapGoogleMapApi) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    // Do stuff with your $scope.
    // Note: Some of the directives require at least something to be defined originally!
    // e.g. $scope.markers = []
    $scope.map = { center : {latitude: 36.990282103105066,
        			longitude: -122.06149578094482}, 
        			markers:[],
        			busInnerStops:[],
        			busOuterStops:[],
        			busStops:[],
        			zoom: ($window.innerWidth > 1024) ? 15 : 14 };

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {
    	getData();
    	fillStops();
    });
  

  	var updateBusMarkers = function(){
		for(var i = 0; i< $scope.map.markers.length;i++){
                //note: predicition array indexes match stop IDs
				$scope.map.markers[i].predictionArray = $scope.map.markers[i].predictions.split(',');

                //Determine which LOOP direction
                if($scope.map.markers[i].route === 'LOOP'    ){
                    if($scope.map.markers[i].predictionArray[1] < $scope.map.markers[i].predictionArray[2] ||
                       $scope.map.markers[i].predictionArray[4] < $scope.map.markers[i].predictionArray[5] ||
                       $scope.map.markers[i].predictionArray[9] < $scope.map.markers[i].predictionArray[12] ||
                       $scope.map.markers[i].predictionArray[14] < $scope.map.markers[i].predictionArray[16] ||
                       $scope.map.markers[i].predictionArray[17] < $scope.map.markers[i].predictionArray[19] ||
                       $scope.map.markers[i].predictionArray[22] < $scope.map.markers[i].predictionArray[25] ||
                       $scope.map.markers[i].predictionArray[28] < $scope.map.markers[i].predictionArray[1]){
                           $scope.map.markers[i].route =  'INNERLOOP';
                    }else{
                           $scope.map.markers[i].route = 'OUTERLOOP';
                    }
                }

                $scope.map.markers[i].icon ='/images/shuttleIcons/' + $scope.map.markers[i].route + 'busS.png';

              
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
    var timeoutID;

    var getData = function() {

    	/*******  animation code *************/
    	// adopted from : http://jsfiddle.net/rcravens/RFHKd/13/
    	var oldbusIndex = 0;
    	var numDeltas = 100;
	    var delay = 5; //milliseconds
	    var i = 0;
	    var deltaLat;
	    var deltaLng;

    	var animateBuses = function(){
    		var AnimationOccured = 0;
			if(oldbusIndex >= $scope.oldBusData.markers.length){
				$scope.map.markers = $scope.busData.markers;
				updateBusMarkers();
			} else{	
					_.each($scope.busData.markers, function (marker, index){
						if(oldbusIndex !== $scope.oldBusData.markers.length){
							if($scope.oldBusData.markers[oldbusIndex].id === marker.id){
								//we need to animate
								if(($scope.oldBusData.markers[oldbusIndex].latitude !==marker.latitude) || 
										($scope.oldBusData.markers[oldbusIndex].longitude !==marker.longitude)){
									
									transition(index);
									AnimationOccured = 1;
								}else{
									if(oldbusIndex !== $scope.oldBusData.markers.length){
										oldbusIndex++;
									}
								}
							}
						}

					});
					if(AnimationOccured === 0){
						oldbusIndex++;
					}else{
						AnimationOccured = 0;
					}
			}
		};

	    var transition = function (index){
	    	if(oldbusIndex >= $scope.oldBusData.markers.length){
	    		return;
	    	}
	        i = 0;
	        deltaLat = ($scope.busData.markers[index].latitude - $scope.oldBusData.markers[oldbusIndex].latitude)/numDeltas;
	        deltaLng = ($scope.busData.markers[index].longitude - $scope.oldBusData.markers[oldbusIndex].longitude)/numDeltas;
	       	if((deltaLat!==0) &&(deltaLng!==0)){
	       		moveMarker();
	       	}else{
	       		oldbusIndex++;
	       	}
	    };
	    
	    var moveMarker = function (){
	    	if(oldbusIndex >= $scope.oldBusData.markers.length || $scope.map.markers[oldbusIndex] === null){
	    		return;
	    	}
	        $scope.map.markers[oldbusIndex].latitude += deltaLat;
	        $scope.map.markers[oldbusIndex].longitude += deltaLng;
	        //update fast but asyncronously no not colide with other updates
	        _.defer(function(){$scope.$apply();});
	        if(i!==numDeltas){
	            i++;
	            setTimeout(moveMarker, delay);
	        }else{
	        	oldbusIndex++;
	        	animateBuses();
	        }
	    };
	    /***************************************/
	    
	    $http({method: 'GET', url: 'http://skynet.soe.ucsc.edu/bts/coord2.json'}).
	    	success(function(data, status, headers, config) {
	      		if($scope.busData){
	      			$scope.oldBusData = $scope.busData;
	      		}else{
	      			$scope.map.markers = data.markers;
	      		}
	      		$scope.busData = data;

	      		
	      		if($scope.oldBusData){
	      			animateBuses();
	      		}else{
	      			updateBusMarkers();
	      		}

	      		timeoutID = $timeout(getData, 3000);

	      		/*Check to see if user is still using the app*/
	      		$window.onblur = function () {
					//$timeout.cancel(timeoutID);
					//$window.onBlur = '';
				};
				$window.onfocus = function () {
					//Restart data refresh requests
					//getData();
					//$window.onBlur = '';
				};

	    	}).
	    	error(function(data, status, headers, config) {
	      		
	      		if ((status >= 400) && (status < 500)) {
                	$scope.busData = 0;
                	$scope.map.markers = 0;
                	return;
	            }
	            if ( (status >= 500) && (status < 600) ) {
	                $scope.busData = 0;
                	$scope.map.markers = 0;
	                return;
	            }

	    	});

	}; 

	var fillStops = function() {
		$scope.map.busInnerStops = [
				{
					id: 2,
					icon: "/images/InnerLoopStop.png",
					latitude:36.9967041015625,
					longitude: -122.063583374023,
					showWindow: false,
					stopName: "Heller & Kerr Hall"
				},
				{
					id: 3,
					icon: "/images/InnerLoopStop.png",
					latitude:36.999210357666,
					longitude: -122.064338684082,
					showWindow: false,
					stopName: "Heller & Kresge College"
				},
				{
					id: 5,
					icon: "/images/InnerLoopStop.png",
					latitude:36.9999313354492,
					longitude: -122.062049865723,
					showWindow: false,
					stopName: "McLaughlin & Science Hill"
				},
				{
					id: 6,
					icon: "/images/InnerLoopStop.png",
					latitude:36.9997062683105,
					longitude: -122.05834197998,
					showWindow: false,
					stopName: "McLaughlin & College 9 & 10 - Health Center"
				},
				{
					id: 10,
					icon: "/images/InnerLoopStop.png",
					latitude:36.9966621398926,
					longitude: -122.055480957031,
					showWindow: false,
					stopName: "Hagar & Bookstore"
				},
				{
					id: 13,
					icon: "/images/InnerLoopStop.png",
					latitude:36.9912567138672,
					longitude: -122.054962158203,
					showWindow: false,
					stopName: "Hagar & East Remote"
				},
				{
					id: 15,
					icon: "/images/InnerLoopStop.png",
					latitude:36.985523223877,
					longitude: -122.053588867188,
					showWindow: false,
					stopName: "Hagar & Lower Quarry Rd"
				},
				{
					id: 17,
					icon: "/images/InnerLoopStop.png",
					latitude:36.9815368652344,
					longitude: -122.052131652832,
					showWindow: false,
					stopName: "Coolidge & Hagar"
				},
				{
					id: 18,
					icon: "/images/InnerLoopStop.png",
					latitude:36.9787902832031,
					longitude: -122.057762145996,
					showWindow: false,
					stopName: "High & Western Dr"
				},
				{
					id: 20,
					icon: "/images/InnerLoopStop.png",
					latitude:36.9773025512695,
					longitude: -122.054328918457,
					showWindow: false,
					stopName: "High & Barn Theater"
				},
				{
					id: 23,
					icon: "/images/InnerLoopStop.png",
					latitude:36.9826698303223,
					longitude: -122.062492370605,
					showWindow: false,
					stopName: "Empire Grade & Arboretum"
				},
				{
					id: 26,
					icon: "/images/InnerLoopStop.png",
					latitude:36.9905776977539,
					longitude: -122.066116333008,
					showWindow: false,
					stopName: "Heller & Oakes College"
				},
				{
					id: 29,
					icon: "/images/InnerLoopStop.png",
					latitude:36.9927787780762,
					longitude: -122.064880371094,
					showWindow: false,
					stopName: "Heller & College 8/Porter"
				}
			];
		$scope.map.busOuterStops = [
				{
					id: 1,
					icon: "/images/OuterLoopStop.png",
					latitude:36.9992790222168,
					longitude: -122.064552307129,
					showWindow: false,
					stopName: "Heller & Kresge College"
				},
				{
					id: 4,
					icon: "/images/OuterLoopStop.png",
					latitude:37.0000228881836,
					longitude: -122.062339782715,
					showWindow: false,
					stopName: "McLaughlin & Science Hill"
				},
				{
					id: 7,
					icon: "/images/OuterLoopStop.png",
					latitude:36.9999389648438,
					longitude: -122.058349609375,
					showWindow: false,
					stopName: "McLaughlin & College 9 & 10 - Health Center"
				},
				{
					id: 8,
					icon: "/images/OuterLoopStop.png",
					latitude:36.9990234375,
					longitude: -122.055229187012,
					showWindow: false,
					stopName: "McLaughlin & Crown College"
				},
				{
					id: 9,
					icon: "/images/OuterLoopStop.png",
					latitude:36.9974822998047,
					longitude: -122.055030822754,
					showWindow: false,
					stopName: "Hagar & Bookstore-Stevenson College"
				},
				{
					id: 11,
					icon: "/images/OuterLoopStop.png",
					latitude:36.9942474365234,
					longitude: -122.055511474609,
					showWindow: false,
					stopName: "Hagar & Field House East"
				},
				{
					id: 12,
					icon: "/images/OuterLoopStop.png",
					latitude:36.9912986755371,
					longitude: -122.054656982422,
					showWindow: false,
					stopName: "Hagar & East Remote"
				},
				{
					id: 14,
					icon: "/images/OuterLoopStop.png",
					latitude:36.985912322998,
					longitude: -122.053520202637,
					showWindow: false,
					stopName: "Hagar & Lower Quarry Rd"
				},
				{
					id: 16,
					icon: "/images/OuterLoopStop.png",
					latitude:36.9813537597656,
					longitude: -122.051971435547,
					showWindow: false,
					stopName: "Coolidge & Hagar"
				},
				{
					id: 19,
					icon: "/images/OuterLoopStop.png",
					latitude:36.9776763916016,
					longitude: -122.053558349609,
					showWindow: false,
					stopName: "Coolidge & Main Entrance"
				},
				{
					id: 21,
					icon: "/images/OuterLoopStop.png",
					latitude:36.9786148071289,
					longitude: -122.05785369873,
					showWindow: false,
					stopName: "High & Western Dr"
				},
				{
					id: 22,
					icon: "/images/OuterLoopStop.png",
					latitude:36.9798469543457,
					longitude: -122.059257507324,
					showWindow: false,
					stopName: "Empire Grade & Tosca Terrace"
				},
				{
					id: 24,
					icon: "/images/OuterLoopStop.png",
					latitude:36.9836616516113,
					longitude: -122.064964294434,
					showWindow: false,
					stopName: "Empire Grade & Arboretum"
				},
				{
					id: 25,
					icon: "/images/OuterLoopStop.png",
					latitude:36.989917755127,
					longitude: -122.067230224609,
					showWindow: false,
					stopName: "Heller & Oakes College"
				},
				{
					id: 27,
					icon: "/images/OuterLoopStop.png",
					latitude:36.991828918457,
					longitude: -122.066833496094,
					showWindow: false,
					stopName: "Heller & Family Student Housing"
				},
				{
					id: 28,
					icon: "/images/OuterLoopStop.png",
					latitude:36.992977142334,
					longitude: -122.065223693848,
					showWindow: false,
					stopName: "Heller & College 8/Porter"
				}
			];

	};	
    
  });
