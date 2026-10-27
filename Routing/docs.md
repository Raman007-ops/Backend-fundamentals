# 🚦 Backend Routing Fundamentals

A concise guide to how routing works in backend applications, with examples in Express.js.

## 📑 Table of Contents

1. [What is Routing?](#1-what-is-routing)
2. [How Routing Works Internally](#2-how-routing-works-internally)
3. [Static Routes](#3-static-routes)
4. [Dynamic Routes](#4-dynamic-routes)
5. [Path Parameters](#5-path-parameters)
6. [Query Parameters](#6-query-parameters)
7. [Nested Routes](#7-nested-routes)
8. [Route Versioning](#8-route-versioning)
9. [API Deprecation](#9-api-deprecation)
10. [Catch-All Routes](#10-catch-all-routes)
11. [Route Design Best Practices](#11-route-design-best-practices)
12. [Key Takeaways](#12-key-takeaways)

---

## 1. What is Routing?

**Routing** is the process of determining which code or function should handle an incoming request.

When a client sends a request:

```http
GET /products
```

The backend asks: *"Who is responsible for handling `/products`?"*

That matching process is called **routing**.

### Flow

```text
Client Request → Router → Matching Route → Controller/Handler → Response
```

---

## 2. How Routing Works Internally

When a request reaches the server:

1. The server receives the request.
2. The router checks:
   - the **HTTP method** (`GET`, `POST`, ...)
   - the **URL path** (`/products`)
3. The router finds a matching route.
4. The corresponding handler is executed.
5. A response is sent back.

**Example:**

```js
app.get("/products", (req, res) => {
  res.send("All products");
});
```

If the request is:

```http
GET /products
```

the backend matches `GET` + `/products` and executes the function.

---

## 3. Static Routes

A **static route** has a fixed path.

```js
app.get("/about", handler);
app.get("/products", handler);
```

URLs:

```text
/about
/products
```

### Characteristics

- Fixed path
- No dynamic value
- Predictable

### Real-world examples

```text
/login
/signup
/dashboard
/profile
```

---

## 4. Dynamic Routes

**Dynamic routes** contain variables.

```js
app.get("/products/:id", handler);
```

Request:

```http
GET /products/123
```

Here, `123` becomes dynamic data, accessible via `req.params.id`.

```js
app.get("/products/:id", (req, res) => {
  res.send(req.params.id);
});
```

Response:

```text
123
```

---

## 5. Path Parameters

**Path params** are values embedded inside the URL path.

Request:

```text
/products/10
```

Route:

```text
/products/:id
```

Access:

```js
req.params.id
```

### Multiple Params

Route:

```text
/users/:userId/orders/:orderId
```

Request:

```text
/users/5/orders/10
```

Result:

```js
req.params = {
  userId: "5",
  orderId: "10"
}
```

---

## 6. Query Parameters

Query params are used for:

- Filtering
- Sorting
- Pagination
- Searching

Request:

```text
/products?page=1&limit=5
```

Access:

```js
req.query.page
req.query.limit
```

```js
app.get("/products", (req, res) => {
  console.log(req.query);
});
```

Output:

```js
{
  page: "1",
  limit: "5"
}
```

### Path Params vs Query Params

| Path Params         | Query Params      |
| ------------------- | ----------------- |
| Identify a resource | Modify behavior   |
| Required            | Optional          |

**Example:**

```text
/products/5        → identifies product 5
/products?page=1   → modifies how the list is returned
```

---

## 7. Nested Routes

**Nested routes** represent relationships between resources.

Example: **User → Orders**

```text
/users/10/orders
/users/10/orders/5
```

```js
app.get("/users/:id/orders", handler);
```

### Why nested routes?

To represent hierarchy, for example:

- Student → Courses
- Product → Reviews
- Blog → Comments

---

## 8. Route Versioning

Versioning is used to avoid breaking existing clients.

**Version 1**

```text
/api/v1/products
```

**Version 2**

```text
/api/v2/products
```

### Why?

Suppose a mobile app depends on the old API. If the backend changes suddenly, the app breaks ❌. Versioning avoids this.

### Best Practice

```text
/api/v1/
/api/v2/
```

---

## 9. API Deprecation

**Deprecation** means an API is old and will be removed later.

```text
/api/v1/products   → still works, but a warning is given
```

New users should use:

```text
/api/v2/products
```

Example header:

```http
Deprecation: true
```

### Purpose

- Smooth migration
- Avoid breaking clients

---

## 10. Catch-All Routes

A **catch-all route** handles requests when no other route matches.

```js
app.use("*", (req, res) => {
  res.status(404).send("Route not found");
});
```

If the request is:

```text
/random-route
```

Response:

```text
404 Route not found
```

> **Note:** Define catch-all routes **last**, after all other routes, so they don't intercept valid requests. In Express 5, the wildcard syntax changed (e.g. use `app.use((req, res) => { ... })` without a path instead).

### Why important?

Prevents:

- Server confusion
- Undefined behavior
- Poor user experience

---

## 11. Route Design Best Practices

### ✅ Use nouns, not verbs

❌ Bad

```text
/getProducts
/createProduct
```

✅ Good

```text
/products
/products/:id
```

Use the HTTP method (`GET`, `POST`, ...) to express the action.

### ✅ Keep URLs predictable

✅ Good

```text
/products/10/reviews
```

❌ Bad

```text
/get-product-review-details
```

### ✅ Version APIs

```text
/api/v1
```

### ✅ Use query params for filtering

```text
/products?category=electronics
```

---

## 12. Key Takeaways

- Routing decides **who handles a request**
- **Static routes** → fixed path
- **Dynamic routes** → variable path
- **Path params** → identify a resource
- **Query params** → modify request behavior
- **Nested routes** → represent relationships
- **Versioning** → prevents breaking apps
- **Deprecation** → supports smooth migration
- **Catch-all routes** → handle invalid URLs