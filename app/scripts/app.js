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
  .module('maptestAppApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'uiGmapgoogle-maps'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

  btsModule.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyDartvWxBRwtQW213XfzXBPSuBn-vn-c1E',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
  });
