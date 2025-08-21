# Customer-UI-SIA

Customer-UI-SIA is a simple and modern web application for managing customer information and orders. It features a user-friendly front end and a robust backend, making it easy to view products, place orders, manage your cart, and analyze top-selling items.

## Technologies Used

**Front End:**
- JavaScript
- React
- Tailwind CSS

**Back End:**
- Java Spring Boot
- MySQL

[![My Skills](https://skillicons.dev/icons?i=js,react,tailwind,java,spring,mysql)](https://skillicons.dev)

## Backend Implementation Methods

The backend is built with Spring Boot and exposes RESTful APIs for products, orders, and payments. Key methods and approaches include:

- **Product Management:**
  - `GET /api/items`: Fetch all products (with optional category filtering and search).
  - `GET /api/items/search?name=...`: Search for products by name.
  - `GET /api/items/{id}`: Get a single product by ID.

- **Order Management:**
  - `POST /api/orders`: Place a new order (with payload including product, customer, quantity, address, payment type, etc.).
  - `GET /api/orders`: Fetch all orders for the current user.
  - `DELETE /api/orders/{orderId}/cancel`: Cancel an order.

- **Payment Integration:**
  - `POST /payments/create-checkout`: Initiate an online test payment for an order; integrates with a test payment provider and redirects to a checkout URL.

- **Cart & Customer Data:**
  - Cart management is handled client-side, while orders and customer data are persisted server-side.
  - Customer and order information is validated and securely transmitted using RESTful requests.

- **Security & Data Management:**
  - Product and order data are stored in a MySQL database and managed using JPA repositories.
  - Data validation, error handling, and transactional integrity are enforced in the backend service layer.

## Features

- View all products available
- Buy items using an online test payment
- Edit existing orders
- Cancel orders
- Track order status
- Add items to cart
- Analyze top-selling items

## Getting Started

### Prerequisites

- Node.js and npm (for running the front end)
- Java (for running the backend)
- MySQL (for the database)

