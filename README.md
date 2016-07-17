# Kafeïne Coffee E-Commerce Application

## Overview
Kafeïne is a simulated online coffee store application.  Retail "options" are available for weekly shipment of coffee for (i) individual users or (ii) families.

The application requires authentication before placing an order, confirming the delivery address, and entering a credit card number.  Credit card transactions are simulated.  If a non-authenticated user attempts to access a page which requires authentication, the user will be re-routed to the login page.

Authentication credentials and order history is stored in a MongoDB database.  Password data is encrypted before being stored in the database.

## Technologies Used

+ Bootstrap
+ MEAN Stack
+ MongoDB
+ AngularJS
+ Express.js
+ node.js
  - mongoose (for communication with MongoDB)
  - bcrypt (for password encryption)
  - stripe (for simulated credit card processing)
  - CORS


