# store-express-api
REST API for an online store using Express.js. It provides a scalable and
efficient backend for managing an online store, supporting essential e-commerce
functionalities such as product management, user authentication, orders, and
more.

## Features
- AUTHENTICATION: Registration, Login, Logout, User Session, Roles;
- USER OPERATIONS: Set additional user data, such as full name, phone number, and shipping address;
- USER CART: Adding and removing products from the user's cart;
- ORDERS: Place orders, cancel orders, order tracking;
- PRODUCTS: Full CRUD. Retrieve and order products by subcategory. Search and filter products. Add, update and delete products. Pagination;

## Technologies Used
- Back-end: Express.js framework;
- Database: MongoDB and Mongoose ODM;
- Authentication: Cookie based authentication using JWT;

## Installation
1. Install dependencies `npm install`;
2. Create `.env` file or paste provided file;
- The file must be in the root directory of the project;
- The file must contain the following environment variables:
* DATABASE_URi
* JWT_SECRET
* SESSION_SECRET
3. Start the RESTful service `npm start`;

## Resources
- API Documentation: [here](https://drive.google.com/file/d/1UjH5sc7PWEYA2Dw_IwuJXl13okQgI4s6/view?usp=sharing);
- Database with dummy data and sample .env file: soon