'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ui.router','ngMaterial','firebase','ngMap'
]).
config( function($stateProvider, $locationProvider) {
  $locationProvider.hashPrefix('!');


});
