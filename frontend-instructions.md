# Coffee Site Frontend

Having done - mostly - the backend, you are going to now build the frontend of the Coffee website using AngularJS. This app will have multiple pages, which means you will need to use ngRoute.

## The Pages

The page you'll need to build are:

1. The home page, which explains to the user what the site is about, and why they should buy coffee from here.
2. The options page, where the user will select the grind type and quantity to buy.
3. The delivery page, where the user will enter the address to delivery the coffee to.
4. The payment page, where they will review the order and submit credit card payment.
6. Thank you page, where they are redirected to after they submit an other.
7. The login page, where the user will login to the site. The following pages will require the user to login before he can access them:
  * options page
  * delivery page
  * payment page
8. The register page, where the user will register for an account on the site so that he can login.

There are screenshots for each page. But feel free to make it look better!

## CORS Setup

You will setup the cors module with your express app, so that the backend can be accessed from a different domain. Read the instructions (code example) here: https://www.npmjs.com/package/cors.

For a detailed explanation of CORS, read https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS.

Once you have your backend set up with CORS, you will run your backend on a port of your choosing. You will start the frontend as a separate project in a separate directory. You will use the `serve` command to serve up the static files in your frontend project, you must use a different port number than the backend. To access the backend, you will need to use the full URL of the backend, for example:

// Base URL of the backend
var API = 'http://localhost:1337';

/* then elsewhere in your code */
$http.get(API + '/options')
  .success(function(data) {
    /* do stuff with data */
  });

## Frontend Setup

1. Setup your HTML file(s), JS files, CSS files, link them up.
2. Include angular.js and angular-route.js:
  * http://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.js
  * http://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular-route.js
3. You will need angular-cookie.js as well:
  * http://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular-cookies.js
4. Use bootstrap's CSS
5. Setup AngularJS app
  * create a module
  * attach that module to a DOM element using the ng-app directive
6. Setup ngRoute routing, the steps:
  * include the angular-route.js script
  * put "ngRoute" as a dependency of the AngularJS module you are using for the app
  * set up a config section that uses $routeProvider to setup the routes
  * setup all the routes and sub-page HTML files for each of the pages you need to build, listed in "The Pages" above. Just put in placeholder text for each one for now.

Run in your front end directory:

serve -p YOUR_PORT_NUMBER

To connect to your backend API - say your backend runs on http://localhost:3000, you will use

var API = 'http://localhost:3000';
$http.get(API + '/options')
  .success(function(data) {
    ...
  });

## The Home Page

Build the home page to look like the home-page.png screenshot. The bootstrap grid system could help:

https://getbootstrap.com/examples/grid/

The "Get Started" link should take you to the options page.

## The Options Page

Build the options page to look like the options-page.png screenshot.

Call the GET /options API to get the list of grind options, you will use the data to populate the dropdown for the Grind Type. You will use a <select> in conjunction with <option> to make this happen. See the docs for more details and examples: https://docs.angularjs.org/api/ng/directive/select

The user has two choices, the individual pack or the family pack. Depending on which one he chooses, when the order button is clicked, it should save the corresponding grind type and quantity to be used later. You will save this information in one of the following way (choose one):

* an object stored in a global variable
* an AngularJS service

Then, the user should be redirected to the delivery page after the submission. How do you perform the redirect? Use $location.path(theURLToRedirectTo) - you will need to add $location a parameter of your controller function, i.e. dependency injection. See detailed documentation: https://docs.angularjs.org/guide/$location

Bonus: in a separate form/section, allow the user to enter exactly how much coffee in pounds he wants.

## The Delivery Page

Build the delivery page to look like the delivery-page.png screenshot. Bonus: use a dropdown for state selection instead of a text field.

When the form is submitted, save the address information for later, again you can store the information in one of the following:

* an object stored in a global variable
* an AngularJS service

After the form is submitted, redirect the user to the payment page.

## The Payment Page

Build the payment page to look like the payment-page.png screenshot, it will populate the statement with data that's been stored from the previous two steps. When the "Pay with Credit Card" button is clicked

* make a request to POST /orders with the gathered information
* redirect them to the thank you page

We will implement payment later.

## The Thank You Page

Build a thank you page. Use your imagination. Make sure you include a link to let them buy more coffee!

## User Registration and Login

### The Register Page

Build a user registration page. When the user submits the form, it will make a request to POST /register to create a user account. If the request was successful, it should display a message that tells them they've successfully created an account, and prompt them to go to the login page to login. If it was unsuccessful, it should display the error message that came back from the backend.

### The Login Page

Build a user login page. When the user submits the form, it will make a request to POST /login to attempt a login. If the login was successful:

1. Take the token returned from the backend and save it in a cookie, using the $cookies service with $cookies.put(). It's up to you to choose the name to use for the cookie. See documentation: https://docs.angularjs.org/api/ngCookies/service/$cookies
2. Redirect to the home page.






### Login Restrictions and Auto-Redirect

Remember that in our wiki app, if the user tries to access an authenticated page, he gets redirected to the login page, and after he successfully logs in, he gets redirected back to where he intended to go. We will re-implement this same feature, but do it all in AngularJS instead.

The following pages are to be restricted behind a login:

* the options page
* the delivery page
* the payment page

When any of these pages are accessed, you will check whether the user has logged in by checking the presence of a login token - stored in a cookie with the $cookies service. How do you know when one of these pages are accessed? You can register an event handler for the $locationChangeStart event, and you can do this in the app.run() block - the run block is used for anything global application initialization that needs to happen - something you can't put into any particular controller. Example:

app.run(function($rootScope, $location, $cookies) {
  $rootScope.$on('$locationChangeStart', function(event, nextUrl, currentUrl) {
    // nextUrl will contain the next full url the app is going to
    // it will be the full URL format like http://localhost:3000/#/options
    // so you will have to parse out the last part of that URL to use for matching
    // once you match one of the 3 restricted pages, redirect them to the login page
    // using $location
    //
    // In order to be able to redirect back to where they intended later on when
    // the user has logged in successfully, you will save the value of nextUrl -
    // also in a cookie.
  });
});

### Redirecting Back

Now that you remember where the user intends to go, redirect him back after a successful login, provided that a redirect URL was saved.

## Bonus: Previous Orders Page

Create a new page to display the user's previous orders using the GET /orders API. This page is also restricted under a login.
