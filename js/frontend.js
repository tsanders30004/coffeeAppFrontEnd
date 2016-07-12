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

          // console.log('currentUrl = ' + currentUrl);
          // console.log('nextUrl = ' + nextUrl);

          var partialUrl = nextUrl.slice(nextUrl.indexOf("#")+1);

          if (partialUrl === '/options' || partialUrl === '/deliveries' || partialUrl === '/payments') {
               // console.log('we have reached one of the pages which must be authenticated');
               // console.log('partial url = ' + partialUrl);
               // console.log('is there a cookie?');
               var cookies = $cookies.get('coffeeAppLoginToken');
               // console.log("cookie will be 'undefined' if there is no cookie; i.e., if the user has not logged in");
               // console.log('cookie = ' + cookies);

               if (cookies !== undefined) {
                    // console.log('user is logged in');
                    // console.log('page to go to = ' + $cookies.get(partialUrl));
                    $location.path($cookies.get(partialUrl));
               } else {
                    // console.log('user is not logged in');
                    $location.path('/login');
               }

               /* save the location of the page which the user was trying to access when he was redirected to the login page */
               $cookies.put('partialUrl', partialUrl);
               // console.log('need to be re-directed to ' + partialUrl);
               // console.log('currentUrl = ' + currentUrl);

               /* if user is logged in, re-direct to the requested page.  if not, reroute to login page. */
               // if (cookies !== undefined) {
               //
               //
               //      /* need to redirect user the the correct page here... */
               //      if (partialUrl === '/options') {
               //           $location.path('/options');
               //      } else if (partialUrl === '/deliveries') {
               //           $location.path('/deliveries');
               //      } else if (partialUrl === '/payments') {
               //           $location.path('/payments');
               //      } else {
               //           console.log('there is some kind of error...  page direction was for a page that should require authentication');
               //           console.log('page name = ' + partialUrl);
               //      }
               // } else {
               //      /* user must not be logged in.  redirect to login page. */
               //      $location.path('/login');
               // }
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
          // console.log('the ' + optionChosen + ' was chosen');
          if(packageType === 'individual') {
               // console.log('the individual option was chosen');
               pkgAndOpt.package = packageType;
               pkgAndOpt.grindType = optionChosen;
          } else if(packageType === 'family') {
               // console.log('the family option was chosen');
               pkgAndOpt.package = packageType;
               pkgAndOpt.grindType = optionChosen;
          } else {
               console.log('unknown error occured.  unknown if individual or family option was chosen');
          }
          // console.log(pkgAndOpt);
          // console.log('should now be directed to delivery page...');
          $location.path('/deliveries');
     };
     $http.get(API + '/options')
     .success(function(data) {
          // console.log("Connected to backend from frontend using http request");
          $scope.grindTypes = data;
          // console.log($scope.grindTypes);
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
          // console.log('marker 001');
          // console.log($scope.deliveryFullName);
          $scope.deliveryAddress = deliveryAddress;

          // console.log(deliveryAddress);
          // console.log('should now be directed to payments page...');
          $location.path('/payments');

     };

     $http.post(API + '/deliveries')                             /* should this be here? */
     .success(function(data) {
          $scope.deliveryTypes = data;
          // console.log($scope.deliveryTypes);
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

     // console.log('should now be directed to the thankyou page...');
     // $location.path('/payments');
     $scope.deliveryAddress = deliveryAddress;
     $scope.pkgAndOpt = pkgAndOpt;
     // console.log($scope.deliveryAddress);

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
     // console.log(data);
     $scope.makePayment = function(){
          $http.post(API + '/orders', data)
          .success(function(data) {
               console.log("OK hooray!");
               console.log(data);
               // console.log('should now be directed to thank page...');
               $location.path('/thankyou');
          });

          /* implement stripe functionality */
          // var amount = 999;
          var amount = $scope.pkgAndOpt.qtyInPounds * $scope.pkgAndOpt.costPerPound * 100;
          console.log('amount = ' + amount);
          var handler = StripeCheckout.configure({
               // my testing public publishable key
               key: 'pk_test_gueNUYd91f9K8pegsWsTk0gb',
               locale: 'auto',
               // once the credit card is validated, this function will be called
               token: function(token) {
                    // Make the request to the backend to actually make a charge
                    // This is the token representing the validated credit card
                    var tokenId = token.id;


                    // $.ajax({
                    //      url: 'http://localhost:3000/charge',
                    //      method: 'POST',
                    //      data: {
                    //           amount: amount,
                    //           token: tokenId
                    //      }
                    // }).then(function(data) {
                    //      console.log('Charge:', data);
                    //      alert('You were charged $' + (data.charge.amount / 100));
                    // });

                    data = {
                              amount: amount,
                              token: tokenId
                    };
                    //
                    // $http.post(API + '/charge', data)
                    // .success(function(data) {
                    //      // $scope.deliveryTypes = data;
                    //      // console.log($scope.deliveryTypes);
                    //      console.log('data from stripe = ' + data)
                    // });


                    console.log('before credit card http call, data = ' + data);
                    $http.post(API + '/charge', data)
                    .then(
                         function(response){
                              console.log('success');
                              console.log(response);
                         },
                         function(response){
                              /* this is not being executed when a credit card is declined - for example... */
                              console.log('failure');
                              console.log(response);
                         }
                    );
               }
          });
          // open the handler - this will open a dialog
          // with a form with it to prompt for credit card
          // information from the user
          handler.open({
               name: 'DC Coffee Store',
               description: 'Paying for coffee',
               amount: amount
          });
          /* end of stripe */
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
               // console.log("in signup function...");
               // console.log(data);
               $scope.loginStatus = true;
               // console.log($scope.loginStatus);
          })
          .error(function (errorData, status) {
               // console.log('user already taken?');
               // console.log(errorData);
               // console.log('test...' + status);
               $scope.loginStatus = false;
               // console.log($scope.loginStatus);
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
          // console.log(data);
          $http.post(API + '/login', data)
          .success(function(data) {
               // console.log(data);
               // console.log('should be creating a cookie now...');
               $cookies.put('coffeeAppLoginToken', data.token);

               /* redirect user to page from whence he came */
               // console.log('about to be redirected after logging in');
               debugger;

               $location.path($cookies.get('partialUrl'));
          })
          .error(function (errorData, status) {
               // console.log(errorData);
               // console.log('test...' + status);
          });
     };


});
