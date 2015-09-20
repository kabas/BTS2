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