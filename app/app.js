'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ui.router','ngMaterial','firebase','bootstrapLightbox','ngMap','md.data.table'
]).
config( function($stateProvider, $locationProvider, $urlRouterProvider) {
  $locationProvider.hashPrefix('!');
    $urlRouterProvider.otherwise('/home');

});


