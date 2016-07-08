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

myApp.controller("OptionsController", function($scope, $http){
     $http.get(API + '/options')
     .success(function(data) {
          console.log("Connected to backend from frontend using http request");
          $scope.grindTypes = data;
          console.log($scope.grindTypes);
     });
});

// angular.module('grind-type', [])
// .controller('GrindController', ['$scope', function($scope) {
//      $scope.data = {
//           model: null,
//           availableOptions: [
//                {value: 'myString', name: 'string'},
//                {value: 1, name: 'integer'},
//                {value: true, name: 'boolean'},
//                {value: null, name: 'null'},
//                {value: {prop: 'value'}, name: 'object'},
//                {value: ['a'], name: 'array'}
//           ]
//      };
// }]);
