'use strict';

/**
 * @ngdoc function
 * @name maptestAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the maptestAppApp
 */
angular.module('BTS2App')
  .controller('PanelCtrl', function ($rootScope, $scope, $timeout, $mdSidenav, $mdUtil) {
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
	
});