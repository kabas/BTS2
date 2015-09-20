'use strict';

/**
 * @ngdoc overview
 * @name maptestAppApp
 * @description
 * # maptestAppApp
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
  .config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    
    $locationProvider.html5Mode(true);
  });

  btsModule.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyDartvWxBRwtQW213XfzXBPSuBn-vn-c1E',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
  });
