// This is to connect to backend
var API = 'http://localhost:3000';

var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function($routeProvider) {
     $routeProvider
     .when('/', {
          controller: 'MainController',
          templateUrl: 'main.html'
     })
     .when('/options', {
          controller: 'OptionsController',
          templateUrl: 'options.html'
     })
     .when('/deliveries', {
          controller: 'DeliveriesController',
          templateUrl: 'deliveries.html'
     })
     .when('/payments', {
          controller: 'PaymentsController',
          templateUrl: 'payments.html'
     });
});

myApp.controller('MainController', function($scope, $http){    /* not sure if routeParams is really needed. */
     $scope.myVar = '';
     $scope.myBoolean = true;
     $scope.myFunction = function(){
          /* function logic here */
     };
     $http.get(API + '/options')
      .success(function(data) {
            console.log("Connected to backend from frontend using http request");
      });
});
