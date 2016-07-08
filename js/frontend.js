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


});


//make a factory that saves the quantity and grindtype

grindType.factory('postOrder', function() {
     var theOrder;
     return {
          getOrder function(){
               quantity: 1,
               grindType: {{}}
          }
     });
     // factory function body that constructs shinyNewServiceInstance
     return shinyNewServiceInstance;
});




myApp.controller("OptionsController", function($scope, $http, $location){
     $scope.goDelivery = function() {
          console.log("print Delivery");



          $location.path('/deliveries');
     };
     $http.get(API + '/options')
     .success(function(data) {
          console.log("Connected to backend from frontend using http request");
          $scope.grindTypes = data;
          console.log($scope.grindTypes);

     });
});








myApp.controller("DelieveriesController", function($scope, $http){
     $scope.pushShipping = function() {
          console.log("print Delivery");
          deliveryOptions.push();
     };

     $http.post(API + '/deliveries')
     .success(function(data) {
          $scope.deliveryTypes = data;
          console.log($scope.deliveryTypes);

     });
});
