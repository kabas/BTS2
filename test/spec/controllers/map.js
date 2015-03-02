'use strict';

describe('Controller: MapCtrl', function () {

  // load the controller's module
  beforeEach(module('maptestAppApp'));


  var mapController, $scope={}, $window;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$window_) {
    var scope = $rootScope.$new();
    mapController = $controller('MapCtrl', {
      $scope: scope,
      $window: _$window_
    });
    $scope.map = { center : {latitude: 36.990282103105066,
          longitude: -122.06149578094482}, 
          markers:[],
          busInnerStops:[],
          busOuterStops:[],
          busStops:[]//,
          //zoom: ($window.innerWidth > 1024) ? 15 : 14 
        };
  }));

  it('should have the center of google maps be ucsc', function(){
    expect($scope.map.center.latitude).to.equal(36.990282103105066);
    expect($scope.map.center.longitude).to.equal(-122.06149578094482);
  });
});
