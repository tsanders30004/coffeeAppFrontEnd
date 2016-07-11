/* Global Variables */

var API = 'http://localhost:3000';      /* for connection to backend */

var pkgAndOpt = {
     package: '',
     grindType: '',
     qtyInPounds: 0.35,
     costPerPound: 20
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

var myApp = angular.module('myApp', ['ngRoute', 'ngCookies']);

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
     })
     .when('/thankyou', {
          // controller: 'PaymentsController',
          templateUrl: 'thankyou.html'
     })
     .when('/register', {
          controller: 'RegisterController',
          templateUrl: 'register.html'
     })
     .when('/login', {
          controller: 'LoginController',
          templateUrl: 'login.html'
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
     // $scope.goPayment = function(fname, addr1, addr2, city, state, zip, delDate){
     $scope.goPayment = function(){
          deliveryAddress =
          {
               fname:     $scope.deliveryFullName,
               addr1:     $scope.deliveryAddr1,
               addr2:     $scope.deliveryAddr2,
               city:      $scope.deliveryCity,
               state:     $scope.deliveryState,
               zip:       $scope.deliveryZip,
               delDate:   $scope.deliveryDate
          };
          console.log('marker 001');
          console.log($scope.deliveryFullName);
          $scope.deliveryAddress = deliveryAddress;

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
     // fname:     fname,
     // addr1:     addr1,
     // addr2:     addr2,
     // city:      city,
     // state:     state,
     // zip:       zip,
     // delDate:   delDate
     //      };

     console.log('should now be directed to the thankyou page...');
     // $location.path('/payments');
     $scope.deliveryAddress = deliveryAddress;
     $scope.pkgAndOpt = pkgAndOpt;
     console.log($scope.deliveryAddress);

     /* $http.post('/someUrl', data, config).then(successCallback, errorCallback); */


     var data =
     {
          "token": "CKmmcsd9foYJbOl32vNu0Y1xKsRiaJsqt3HmhDXvm8ZKF66laUSJhZFEnphDYGXN",
          "order": {
               "options": {
                    "grind": pkgAndOpt.grindType,
                    "quantity": pkgAndOpt.qtyInPounds
               },
               "address": {
                    name: deliveryAddress.fname,
                    address: deliveryAddress.addr1,
                    address2: deliveryAddress.addr2,
                    city: deliveryAddress.city,
                    state: deliveryAddress.state,
                    zipCode: deliveryAddress.zip,
                    deliveryDate: deliveryAddress.delDate
               }
          },
          "stripeToken": "ETSDNF7249L8G09CIPLXCHIGCDG89CHPG"
     };
     console.log(data);
     $scope.makePayment = function(){
          $http.post(API + '/orders', data)
          .success(function(data) {
               console.log("OK hooray!");
               console.log(data);
               console.log('should now be directed to thank page...');
               $location.path('/thankyou');
          });
     };
});


myApp.controller("RegisterController", function($scope, $http, $location){

     $scope.registerUser = function() {
          var data =
          {
               "_id": $scope.userName,
               "password": $scope.password,
               "confirmPassword": $scope.confirmPassword,
               "email": $scope.email
          };
          // console.log('marker0003');
          // console.log(data);

          $http.post(API + '/signup', data)
          .success(function(data) {
               console.log("in signup function...");
               console.log(data);
               $scope.loginStatus = true;
               console.log($scope.loginStatus);
          })
          .error(function (errorData, status) {
               console.log('user already taken?');
               console.log(errorData);
               console.log('test...' + status);
               $scope.loginStatus = false;
               console.log($scope.loginStatus);
          });
     };

});

myApp.controller("LoginController", function($scope, $cookies, $http, $location){

     $scope.loginUser = function() {
          var cookies = $cookies.get();
          var data =
          {
               "_id": $scope.userName,
               "password": $scope.password,
          };
          console.log(data);
          $http.post(API + '/login', data)
          .success(function(data) {
               console.log(data);
               $cookies.put('token', data.token);
               $location.path("/");
          })
          .error(function (errorData, status) {
               console.log(errorData);
               console.log('test...' + status);
          });
     };


});
