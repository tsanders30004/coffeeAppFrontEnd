/* Global Variables */

var API = 'http://localhost:3000';      /* for connection to backend */

var pkgAndOpt = {                       /* used to store which option (indiv or family) and grinmd type were selected by the user */
     package: '',                       /* is this the best place to store this variable - or should it go in the options controller? */
     grindType: ''
};

var deliveryAddress = {
     fname:     "",
     addr1:     "",
     addr2:     "",
     city:      "",
     state:     "",
     zip:       "",
     delDate:    ""
};

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

myApp.controller("OptionsController", function($scope, $http, $location){
     $scope.goDelivery = function(packageType, optionChosen) {
          console.log('the ' + optionChosen + ' was chosen');
          if(packageType === 'individual') {
               console.log('the individual option was chosen');
               pkgAndOpt.package = packageType;
               pkgAndOpt.grindType = optionChosen;
          } else if(packageType === 'family') {
               console.log('the family option was chosen');
               pkgAndOpt.package = packageType;
               pkgAndOpt.grindType = optionChosen;
          } else {
               console.log('unknown error occured.  unknown if individual or family option was chosen');
          }
          console.log(pkgAndOpt);
          console.log('should now be directed to delivery page...');
          $location.path('/deliveries');
     };
     $http.get(API + '/options')
     .success(function(data) {
          console.log("Connected to backend from frontend using http request");
          $scope.grindTypes = data;
          console.log($scope.grindTypes);
     });
});

myApp.controller("DeliveriesController", function($scope, $http, $location){
     $scope.goPayment = function(fname, addr1, addr2, city, state, zip, delDate){
          deliveryAddress =
          {
               fname:     fname,
               addr1:     addr1,
               addr2:     addr2,
               city:      city,
               state:     state,
               zip:       zip,
               delDate:   delDate
          };

          console.log(deliveryAddress);
          console.log('should now be directed to payments page...');
          $location.path('/payments');

     };

     $http.post(API + '/deliveries')                             /* should this be here? */
     .success(function(data) {
          $scope.deliveryTypes = data;
          console.log($scope.deliveryTypes);
     });

});

/* start the payment controller here... */
myApp.controller("PaymentsController", function($scope, $http, $location){      /* do I really need $location? */
     // $scope.goPayment = function(fname, addr1, addr2, city, state, zip, delDate){
     //      deliveryAddress =
     //      {
     //           fname:     fname,
     //           addr1:     addr1,
     //           addr2:     addr2,
     //           city:      city,
     //           state:     state,
     //           zip:       zip,
     //           delDate:   delDate
     //      };

     console.log('should now be directed to the thankyou page...');
     // $location.path('/payments');

     $http.post(API + '/thankyou')                             /* should this be here? */
     .success(function(data) {
          $scope.deliveryTypes = data;
          console.log($scope.deliveryTypes);
     });

});
