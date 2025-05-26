# 🧪 Postman API Testing Guide – E-commerce Backend

This guide walks through how to test the Node.js + MongoDB e-commerce backend using Postman.

---

## 🚀 1. Setup Instructions

### Environment:

* Base URL: `http://localhost:5000`
* Set variable: `{{token}}` to your JWT token after login/register

---

## 👤 2. User Routes

### 🔹 POST /api/users/register

* Registers a new user.
* **Body (JSON):**

```json
{
  "name": "Admin Guy",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

* **Expected:** 201 Created, returns token.

### 🔹 POST /api/users/login

* Logs in user.
* **Body (JSON):**

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

* **Expected:** JWT token

### 🔹 GET /api/users/me

* View current user info.
* **Headers:** `Authorization: Bearer {{token}}`
* **Expected:** User profile JSON

---

## 📦 3. Product Routes

### 🔹 GET /api/products

* Fetch all products.
* **Expected:** Array of product objects.

### 🔹 GET /api/products/\:id

* Get single product by ID.
* **Expected:** Product object

### 🔹 POST /api/products (Admin only)

* Create new product.
* **Headers:** `Authorization: Bearer {{token}}`
* **Body (JSON):**

```json
{
  "name": "Sneakers",
  "price": 99.99,
  "stock": 50,
  "description": "High-quality running shoes"
}
```

* **Expected:** 201 Created with product JSON

### 🔹 PUT /api/products/\:id (Admin only)

* Update product fields.
* **Body:** Any editable field (name, price, etc.)

### 🔹 DELETE /api/products/\:id (Admin only)

* **Expected:** 200 OK if deleted

---

## 🛡 4. Auth Testing

* Test protected endpoints without token → expect 401 Unauthorized.
* Try using a customer token on admin-only endpoints → expect 403 Forbidden.

---

## 📌 5. Notes

* Always set the token after login.
* Use variables to manage dynamic IDs.
* Use the CLI (`viewUsers.js`, `viewProductById.js`) to fetch valid IDs quickly.

---

✅ This guide ensures full API coverage and verifies both success and failure cases for your backend.
