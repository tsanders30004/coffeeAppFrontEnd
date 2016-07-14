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

myApp.run(function($rootScope, $location, $cookies) {
     $rootScope.$on('$locationChangeStart', function(event, nextUrl, currentUrl) {

          var partialUrl = nextUrl.slice(nextUrl.indexOf("#")+1);

          if (partialUrl === '/options' || partialUrl === '/deliveries' || partialUrl === '/payments') {

               var cookies = $cookies.get('coffeeAppLoginToken');

               if (cookies !== undefined) {
                    $location.path($cookies.get(partialUrl));
               } else {
                    $location.path('/login');
               }

               $cookies.put('partialUrl', partialUrl);
          }
     });
});

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

myApp.controller('MainController', function($scope, $http){
});

myApp.controller("OptionsController", function($scope, $http, $location){
     $scope.goDelivery = function(packageType, optionChosen) {
          if(packageType === 'individual') {
               pkgAndOpt.package = packageType;
               pkgAndOpt.grindType = optionChosen;
          } else if(packageType === 'family') {
               pkgAndOpt.package = packageType;
               pkgAndOpt.grindType = optionChosen;
          } else {
               console.log('unknown error occured.  unknown if individual or family option was chosen');
          }
          $location.path('/deliveries');
     };

     $http.get(API + '/options')
     .then(
          function(response){    /* success */
               $scope.grindTypes = response.data;
               console.log('OptionsController');
               console.log(response.status);
               console.log(response.statusText);
          },
          function(response){    /* error */
               console.log('There was an an error in the $HTTP call in the OptionsController.');
               console.log(response.status);
               console.log(response.statusText);
          });
});

myApp.controller("DeliveriesController", function($scope, $http, $location){
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
          $scope.deliveryAddress = deliveryAddress;
          $location.path('/payments');
     };

     $http.post(API + '/deliveries')
     .then(
          function(response){
               $scope.deliveryTypes = response.data;
               console.log('DeliveriesController');
               console.log(response.status);
               console.log(response.statusText);
          },
          function(response){
               console.log('There was an an error in the $HTTP call in the DeliveriesController.');
               console.log(response.status);
               console.log(response.statusText);
          }
     );
});

myApp.controller("PaymentsController", function($scope, $http, $location, $cookies){      /* do I really need $location? */
     $scope.deliveryAddress = deliveryAddress;
     $scope.pkgAndOpt = pkgAndOpt;
     var data =
     {
          "token": $cookies.get("coffeeAppLoginToken"),
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

     $scope.makePayment = function(){
          var amount = $scope.pkgAndOpt.qtyInPounds * $scope.pkgAndOpt.costPerPound * 100;
          var handler = StripeCheckout.configure({
               key: 'pk_test_gueNUYd91f9K8pegsWsTk0gb',
               locale: 'auto',
               token: function(token) {
                    var tokenId = token.id;
                    $http.post(API + '/charge', data)
                    .then(
                         function(response){
                              console.log('$scope.makePayment function');
                              console.log(response.status);
                              console.log(response.statusText);
                              $http.post(API + '/orders', data)
                              .then(
                                   function(response){
                                        $location.path('/thankyou');
                                        console.log('$scope.makePayment function');
                                        console.log(response.status);
                                        console.log(response.statusText);
                                   },
                                   function(response){
                                        console.log('There was an an error in the $HTTP call in the $scope.makePayment function');
                                        console.log(response.status);
                                        console.log(response.statusText);
                                   }
                              );
                         },
                         function(response){
                              console.log('There was an an error in the $HTTP call in the $scope.makePayment function.');
                              console.log(response.status);
                              console.log(response.statusText);
                         }
                    );
               }
          });

          handler.open({
               name: 'Web Caffeine',
               description: 'Online Coffee Charges:  Web Caffeine',
               amount: amount
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

          $http.post(API + '/signup', data)
          .then(
               function(response){
                    $scope.loginStatus = true;
                    console.log('RegisterController');
                    console.log(response.status);
                    console.log(response.statusText);
               },
               function(response){
                    $scope.loginStatus = false;
                    console.log('There was an an error in the $HTTP call in the RegisterController.');
                    console.log(response.status);
                    console.log(response.statusText);
               }
          );
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

          $http.post(API + '/login', data)
          .then(
               function(response){
                    $cookies.put('coffeeAppLoginToken', data.token);
                    $location.path($cookies.get('partialUrl'));
                    console.log('LoginController');
                    console.log(response.status);
                    console.log(response.statusText);
               },
               function(response){
                    console.log('There was an an error in the $HTTP call in the LoginController.');
                    console.log(response.status);
                    console.log(response.statusText);
               }
          );
     };
});
