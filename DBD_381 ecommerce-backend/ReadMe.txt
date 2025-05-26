# Final Report – NoSQL E-commerce Marketplace Project

## 1. Project Scope

This project involves designing and implementing a NoSQL distributed database system for an e-commerce marketplace. The goal is to support scalable data operations across users, products, and orders, enabling high performance under load and dynamic schema management.

## 2. Technology Selection: MongoDB

**Reasons for Selection:**

* Flexible document schema using BSON
* Supports embedded and referenced relationships
* Strong community and driver support
* Horizontal scalability (sharding, replica sets)
* Easy integration with Node.js via Mongoose ODM

## 3. System Design

### Backend:

* **Node.js** & **Express**
* Modular structure: routes, controllers, middleware
* JWT authentication & role-based authorization

### MongoDB Schema Design:

* `User`: name, email, hashed password, role (admin/customer)
* `Product`: name, price, stock, description
* `Order`: user, product list, total price, status

## 4. Implementation

* Secure JWT auth (with role-based middleware)
* CLI scripts for:

  * Viewing/editing users/products
  * Load testing API
* CRUD APIs: GET, POST, PUT, DELETE for products and users
* Load testing simulates 50+ concurrent requests

## 5. Testing & Performance

**Tools Used:** Postman, CLI scripts, `axios`, `ora`, `chalk`

**Load Testing Results:**

* 50 requests handled within acceptable latency
* MongoDB shows efficient reads and writes

**Manual Testing:**

* Register/login flows verified
* Token-based access control
* Admin-only edit/delete privileges

## 6. CLI Enhancements

* Uses `chalk` for styled terminal UI
* Interactive prompts with `readline`
* Live spinner with `ora`
* Input validation and graceful error handling

## 7. Challenges & Solutions

| Problem                    | Fix                                            |
| -------------------------- | ---------------------------------------------- |
| ESM error with chalk/ora   | Switched to chalk\@4 and added dynamic imports |
| Spinner not showing        | Delayed axios call to allow visual loading     |
| Role auth failed           | Decoded token and enforced admin check         |
| CLI crashed on wrong input | Validated all CLI input fields                 |

## 8. Recommendations

* Deploy backend via Docker or MongoDB Atlas
* Add Redis caching for product queries
* Support file upload (e.g. images for products)
* Add Mocha/Jest unit tests
* Optional: Build a React frontend

## 9. Future Work

* Migrate to MongoDB Atlas (cloud scalability)
* Add analytics dashboard (track orders/products)
* Machine learning for product recommendations

## 10. Summary

The project successfully demonstrates how MongoDB can be leveraged to build a fast, flexible, and interactive backend for an e-commerce marketplace. All key features were implemented and tested, and CLI tools enhanced usability for managing the platform as an admin.
