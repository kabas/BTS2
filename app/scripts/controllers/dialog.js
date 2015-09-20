'use strict';

/**
 * @ngdoc function
 * @name maptestAppApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the App
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