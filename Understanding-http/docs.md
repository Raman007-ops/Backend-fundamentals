# 🌐 HTTP Fundamentals — Backend Engineering Notes

> **Goal:** Understand how HTTP works, how clients communicate with servers, and how HTTP fundamentals influence backend API design, security, and performance.

## 📚 Table of Contents

1. [What Is HTTP?](#1-what-is-http)
2. [Client-Server Model](#2-client-server-model)
3. [Statelessness](#3-statelessness)
4. [Evolution of HTTP](#4-evolution-of-http)
5. [HTTP Methods](#5-http-methods)
6. [Idempotency](#6-idempotency)
7. [HTTP Headers](#7-http-headers)
8. [Extensibility of HTTP](#8-extensibility-of-http)
9. [HTTP Status Codes](#9-http-status-codes)
10. [Content Negotiation](#10-content-negotiation)
11. [CORS: Simple and Preflight Requests](#11-cors-simple-and-preflight-requests)
12. [Persistent Connections](#12-persistent-connections)
13. [Handling Large Requests and Responses](#13-handling-large-requests-and-responses)
14. [HTTPS, SSL, and TLS](#14-https-ssl-and-tls)
15. [Key Takeaways](#15-key-takeaways)
16. [Practical Implementations](#16-practical-implementations)
17. [Interview Questions](#17-interview-questions)

---

## 1. What Is HTTP?

**HTTP (Hypertext Transfer Protocol)** is a stateless, application-layer protocol used for communication between clients and servers.

### Key Characteristics

* Follows a request-response communication model.
* Operates at the application layer.
* HTTP/1.1 and HTTP/2 typically use TCP.
* HTTP/3 uses QUIC, which operates over UDP.
* Supports methods, headers, status codes, and message bodies.
* Forms the foundation of web applications and most web APIs.

### Basic Communication Flow

```text
Client
  |
  | HTTP Request
  v
Server
  |
  | HTTP Response
  v
Client
```

### Why Does HTTP Matter in Backend Development?

Backend developers use HTTP to design APIs, exchange data, authenticate requests, communicate errors, and control how clients interact with server resources.

---

## 2. Client-Server Model

HTTP communication generally involves two roles.

| Component | Responsibility                                           | Examples                        |
| --------- | -------------------------------------------------------- | ------------------------------- |
| Client    | Sends requests and consumes responses                    | Browser, mobile app, API client |
| Server    | Receives requests, processes them, and returns responses | Node.js server, API server      |

### Request-Response Lifecycle

```text
Client
  |
  | 1. Sends HTTP request
  v
Web Server
  |
  | 2. Processes request
  | 3. Generates response
  v
Client
  |
  | 4. Processes response
  v
Application
```

A typical HTTP request contains:

* HTTP method
* Request target
* HTTP version
* Headers
* Optional body

A typical HTTP response contains:

* HTTP version
* Status code
* Reason phrase, where applicable
* Headers
* Optional body

### Example HTTP Request

```http
GET /api/users HTTP/1.1
Host: localhost:3000
Accept: application/json
```

### Example HTTP Response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Users retrieved successfully"
}
```

---

## 3. Statelessness

HTTP is a **stateless protocol**, meaning the protocol itself does not require the server to remember the state of previous requests when processing a new request.

Each request must contain the information necessary for the server to process it.

### Example

```text
Request 1: GET /profile
Request 2: GET /profile
```

The server does not automatically know that both requests came from the same authenticated user.

The application must establish that relationship using mechanisms such as cookies, sessions, or tokens.

### How Applications Maintain State

| Mechanism | How It Works                                                          |
| --------- | --------------------------------------------------------------------- |
| Cookies   | Store data in the client and send matching cookies with requests      |
| Sessions  | Store session state on the server, usually referenced by a session ID |
| JWT       | Carries claims in a signed token that the server can validate         |

**Important:** These mechanisms help applications maintain state without changing HTTP's fundamental stateless nature.

### Why Statelessness Matters

* Makes independent requests easier to process.
* Supports horizontal scaling.
* Simplifies communication between distributed components.
* Requires explicit handling of authentication and application state.

### Interview Question

**If HTTP is stateless, how does a website remember that you are logged in?**

A typical answer: The browser sends a session cookie or authentication token with subsequent requests, allowing the server to identify the authenticated user.

---

## 4. Evolution of HTTP

HTTP has evolved to improve connection management, latency, and request processing.

| Version  | Key Characteristics                                                                            |
| -------- | ---------------------------------------------------------------------------------------------- |
| HTTP/1.0 | Connections were commonly opened separately for individual requests                            |
| HTTP/1.1 | Persistent connections became the default behavior; introduced chunked transfer encoding       |
| HTTP/2   | Binary framing, multiplexing, and header compression                                           |
| HTTP/3   | Uses QUIC over UDP, reducing transport-level head-of-line blocking between independent streams |

### HTTP/1.1

Persistent connections allow multiple requests and responses to use the same connection.

### HTTP/2

Multiple streams can share a single TCP connection, allowing concurrent exchanges without requiring a separate connection for each request.

### HTTP/3

QUIC integrates transport security and stream multiplexing. Loss affecting one stream does not necessarily block progress on other streams.

**Key takeaway:** Newer HTTP versions improve transport efficiency, but application-level design still matters for performance.

---

## 5. HTTP Methods

HTTP methods communicate the intended operation on a resource.

| Method    | Purpose                                             | Typically Safe? | Idempotent?     |
| --------- | --------------------------------------------------- | --------------- | --------------- |
| `GET`     | Retrieve a resource                                 | Yes             | Yes             |
| `HEAD`    | Retrieve response headers without the response body | Yes             | Yes             |
| `POST`    | Submit data or request processing                   | No              | No, by default  |
| `PUT`     | Create or replace a resource at a known target URI  | No              | Yes             |
| `PATCH`   | Partially modify a resource                         | No              | Not necessarily |
| `DELETE`  | Request resource deletion                           | No              | Yes             |
| `OPTIONS` | Discover communication options                      | Yes             | Yes             |

### Safe Methods

A safe method is intended to be read-only from the client's perspective.

Examples:

* `GET`
* `HEAD`
* `OPTIONS`

A server may still produce incidental effects, such as logging or metrics, when processing these requests.

### Idempotent Methods

An idempotent method has the same intended effect on the server when the same request is repeated.

Examples:

* `GET`
* `PUT`
* `DELETE`

See [Idempotency](#6-idempotency) for details.

---

## 6. Idempotency

An operation is **idempotent** when repeating it produces the same intended server-side effect as performing it once.

### Example: PUT

```http
PUT /api/users/42
Content-Type: application/json

{
  "name": "Raman"
}
```

Repeating this request with the same representation should leave the resource in the same intended state.

### Example: DELETE

```http
DELETE /api/users/42
```

The first request may delete the resource. Repeating the request should not delete it again or create another effect on the resource.

The server might return `204 No Content` for the first request and `404 Not Found` for a subsequent request. Different responses do not necessarily mean the operation is non-idempotent.

### Example: POST

```http
POST /api/orders
Content-Type: application/json

{
  "productId": 101,
  "quantity": 1
}
```

Repeating this request may create multiple orders.

However, applications can implement idempotency keys to prevent duplicate processing.

### Why Idempotency Matters

* Enables safer retries after network failures.
* Helps prevent duplicate operations.
* Improves reliability in distributed systems.
* Matters when clients cannot determine whether a previous request succeeded.

**Important distinction:** Idempotency concerns the intended server-side effect, not whether every response is identical.

---

## 7. HTTP Headers

HTTP headers are fields that carry metadata and influence how requests and responses are processed.

Headers generally follow this structure:

```text
Header-Name: Header-Value
```

### Request Headers

Sent by clients to communicate information about the request.

| Header          | Purpose                                      |
| --------------- | -------------------------------------------- |
| `Authorization` | Supplies authentication credentials          |
| `Accept`        | Specifies acceptable response media types    |
| `Content-Type`  | Describes the media type of the request body |
| `User-Agent`    | Identifies the client software               |
| `Origin`        | Identifies the origin of a browser request   |

### Response Headers

Sent by servers to communicate information about the response.

| Header                        | Purpose                                                             |
| ----------------------------- | ------------------------------------------------------------------- |
| `Content-Type`                | Describes the response body's media type                            |
| `Cache-Control`               | Controls caching behavior                                           |
| `Set-Cookie`                  | Instructs the client to store a cookie                              |
| `Location`                    | Identifies a resource or redirect target, depending on the response |
| `Access-Control-Allow-Origin` | Communicates allowed origins for CORS                               |

### Connection and Message Metadata

| Header           | Purpose                                                       |
| ---------------- | ------------------------------------------------------------- |
| `Date`           | Indicates when the message was generated                      |
| `Content-Length` | Specifies the message content length in bytes when applicable |
| `Connection`     | Controls connection-specific behavior in HTTP/1.x             |

`Connection` is a hop-by-hop header used in HTTP/1.x. It must not be used in HTTP/2 or HTTP/3.

### Example

```http
POST /api/users HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Accept: application/json
Authorization: Bearer example-token

{
  "name": "Raman"
}
```

### Why Headers Matter

Headers support:

* Authentication
* Content negotiation
* Caching
* Browser security policies
* Message metadata
* Connection management

**Note:** Modern HTTP does not formally classify `Content-Length` as an entity header category. HTTP header fields are better understood by their individual semantics.

---

## 8. Extensibility of HTTP

HTTP can evolve through new methods, header fields, status codes, and protocol extensions.

### Examples

**Custom application headers**

```http
X-Request-ID: abc123
```

**Standardized headers**

```http
Cache-Control: no-cache
```

**New application capabilities**

An API can introduce new endpoints and request fields while maintaining compatibility with existing clients, provided the changes are designed appropriately.

### Important Consideration

Custom headers should be introduced only when necessary. Prefer established, standardized headers when they already solve the problem.

The `X-` prefix is no longer recommended as a general convention for new custom header names.

---

## 9. HTTP Status Codes

HTTP status codes indicate the result of processing a request.

### Status Code Categories

| Range | Category      | Meaning                                                     |
| ----- | ------------- | ----------------------------------------------------------- |
| `1xx` | Informational | Request processing is continuing                            |
| `2xx` | Success       | Request was successfully received, understood, or processed |
| `3xx` | Redirection   | Further action is needed, often involving another URI       |
| `4xx` | Client Error  | The request cannot or will not be fulfilled as submitted    |
| `5xx` | Server Error  | The server failed to fulfill an apparently valid request    |

### Common Status Codes

| Status Code | Name                  | Typical Use                                                     |
| ----------- | --------------------- | --------------------------------------------------------------- |
| `200`       | OK                    | Successful request                                              |
| `201`       | Created               | Resource created successfully                                   |
| `202`       | Accepted              | Request accepted for processing, but processing is not complete |
| `204`       | No Content            | Successful request with no response content                     |
| `301`       | Moved Permanently     | Permanent redirection                                           |
| `302`       | Found                 | Temporary redirection                                           |
| `304`       | Not Modified          | Cached representation can be reused                             |
| `400`       | Bad Request           | Invalid or malformed request                                    |
| `401`       | Unauthorized          | Valid authentication credentials are missing or invalid         |
| `403`       | Forbidden             | Server refuses to authorize the request                         |
| `404`       | Not Found             | Requested resource was not found                                |
| `409`       | Conflict              | Request conflicts with the current resource state               |
| `422`       | Unprocessable Content | Request content cannot be processed semantically                |
| `429`       | Too Many Requests     | Rate limit exceeded                                             |
| `500`       | Internal Server Error | Unexpected server-side failure                                  |
| `502`       | Bad Gateway           | Gateway received an invalid upstream response                   |
| `503`       | Service Unavailable   | Server is temporarily unable to handle the request              |
| `504`       | Gateway Timeout       | Gateway did not receive a timely upstream response              |

### Example API Responses

Successful response:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "User retrieved successfully"
}
```

Client error:

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Invalid request payload"
}
```

Server error:

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": "An unexpected error occurred"
}
```

**Backend principle:** Return meaningful status codes without exposing internal stack traces, credentials, or sensitive implementation details.

---

## 10. Content Negotiation

Content negotiation allows a client and server to agree on the representation used to exchange data.

### The `Accept` Header

The client uses `Accept` to indicate which response media types it can handle.

Example:

```http
GET /api/users/42 HTTP/1.1
Host: localhost:3000
Accept: application/json
```

The server can respond with:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 42,
  "name": "Raman"
}
```

### The `Content-Type` Header

`Content-Type` describes the media type of the message content.

For example:

```http
Content-Type: application/json
```

This tells the receiver that the body contains JSON.

### Difference Between `Accept` and `Content-Type`

| Header         | Meaning                                     |
| -------------- | ------------------------------------------- |
| `Accept`       | What response formats the client can accept |
| `Content-Type` | What format the current message body uses   |

**Remember:** `Accept` describes the desired response representation, while `Content-Type` describes the representation actually being sent.

---

## 11. CORS: Simple and Preflight Requests

**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism that uses HTTP headers to control whether frontend JavaScript can access responses from another origin.

An origin is defined by its scheme, hostname, and port.

For example:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3000
```

These are different origins because their ports differ.

### Simple Requests

Certain cross-origin requests can be sent without a preflight request.

A request may qualify as a CORS-safelisted request when its method, headers, and other characteristics meet the relevant restrictions.

Common examples include certain `GET` and `POST` requests using safelisted headers and content types.

### Preflight Requests

Browsers send a preflight request when a cross-origin request requires permission to use a method, headers, or other features that trigger preflight.

The preflight request uses the `OPTIONS` method.

Example:

```http
OPTIONS /api/users HTTP/1.1
Host: localhost:3000
Origin: http://localhost:5173
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: authorization, content-type
```

The server may respond:

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type
```

### Important Points

* CORS is enforced by browsers.
* CORS is not an authentication mechanism.
* CORS does not prevent non-browser clients from sending requests.
* A preflight request does not contain the actual application request.
* Not every cross-origin request requires preflight.

**Backend takeaway:** Configure CORS deliberately, and never treat it as a replacement for authentication or authorization.

---

## 12. Persistent Connections

Persistent connections allow multiple HTTP requests and responses to reuse the same transport connection.

### HTTP/1.1

Connections are persistent by default unless closed or otherwise managed.

This reduces the overhead associated with establishing a new TCP connection for every request.

### HTTP/2

Multiple concurrent streams can share one TCP connection.

### HTTP/3

Multiple streams can share a QUIC connection.

### Benefits

* Reduces connection-establishment overhead.
* Can reduce latency.
* Improves network resource utilization.
* Supports more efficient communication.

### Important Note

The following header is associated with HTTP/1.x connection management:

```http
Connection: keep-alive
```

HTTP/2 and HTTP/3 do not use the `Connection` header. Their connection management follows different protocol rules.

---

## 13. Handling Large Requests and Responses

Backend systems must process large payloads and datasets efficiently.

### 13.1 Pagination

Pagination divides large collections into smaller responses.

Example:

```http
GET /api/products?page=2&limit=20
```

This requests a page of 20 products.

Common approaches include:

* Offset pagination
* Cursor pagination

Cursor pagination is often useful for large datasets or frequently changing collections.

### 13.2 Streaming

Streaming allows data to be processed or transmitted incrementally rather than buffering the entire payload in memory.

Examples:

* Downloading large files
* Streaming database query results
* Processing uploaded files
* Server-Sent Events

### 13.3 Chunked Transfer Encoding

In HTTP/1.1, chunked transfer encoding allows a message body to be sent in chunks without declaring the final body length in advance.

Example:

```http
Transfer-Encoding: chunked
```

This is a transfer-coding mechanism for HTTP/1.1. HTTP/2 and HTTP/3 use their own framing mechanisms and do not support the HTTP/1.1 `Transfer-Encoding: chunked` mechanism.

### 13.4 Compression

Compression reduces the amount of data transmitted over the network.

Common algorithms include:

* Gzip
* Brotli

The client can indicate supported content codings:

```http
Accept-Encoding: gzip, br
```

The server may select a supported coding and indicate it in the response:

```http
Content-Encoding: gzip
```

### Backend Performance Principle

Use pagination, streaming, and compression when appropriate. Choose based on payload size, latency, memory consumption, and workload requirements.

---

## 14. HTTPS, SSL, and TLS

### HTTP vs HTTPS

| Feature               | HTTP                        | HTTPS                                           |
| --------------------- | --------------------------- | ----------------------------------------------- |
| Transport security    | No inherent encryption      | HTTP protected by TLS                           |
| Confidentiality       | Not provided by HTTP itself | Provided by TLS                                 |
| Integrity protection  | Not provided by HTTP itself | Provided by TLS                                 |
| Server authentication | Not provided by HTTP itself | Usually provided through certificate validation |
| Common default port   | `80`                        | `443`                                           |

HTTPS protects HTTP communication against many forms of interception and tampering when TLS is configured and validated correctly.

### SSL vs TLS

* **SSL (Secure Sockets Layer):** Legacy protocol family that is obsolete and insecure.
* **TLS (Transport Layer Security):** Modern protocol used to secure HTTPS connections.

TLS replaced SSL. Modern applications should use supported TLS versions rather than SSL.

### Simplified HTTPS Connection Flow

```text
Client                         Server
  |                               |
  |------ Connect --------------->|
  |                               |
  |<----- Server Certificate -----|
  |                               |
  |--- Validate Certificate ----->|
  |                               |
  |<---- TLS Handshake ---------->|
  |                               |
  |==== Encrypted HTTP Data ======|
  |                               |
```

This diagram is simplified. In TLS 1.3, key establishment and certificate authentication occur within a defined handshake flow, and some handshake messages are encrypted.

### What Happens During a TLS Handshake?

At a high level:

1. The client and server negotiate supported TLS parameters.
2. They establish shared cryptographic secrets.
3. The server proves its identity using its certificate and associated cryptographic proof.
4. The client validates the certificate chain and hostname.
5. Both sides establish keys for protecting application data.
6. HTTP messages are exchanged over the protected connection.

### Why TLS Matters

TLS provides:

* **Confidentiality:** Helps prevent unauthorized parties from reading traffic.
* **Integrity:** Helps detect unauthorized modification of traffic.
* **Authentication:** Usually allows clients to verify the server's identity.

**Important:** HTTPS does not guarantee that a website is trustworthy or that its application is free from vulnerabilities. It protects communication with the authenticated server.

---

## 15. Key Takeaways

### Core HTTP Concepts

* HTTP is an application-layer request-response protocol.
* HTTP is stateless at the protocol level.
* Cookies, sessions, and tokens help applications maintain state.
* HTTP methods communicate the intended operation on a resource.
* Status codes communicate the outcome of request processing.
* Headers carry metadata and influence communication behavior.
* Content negotiation helps clients and servers agree on representations.

### Reliability

* Understand idempotency before implementing retries.
* Use appropriate methods for resource operations.
* Return meaningful status codes.
* Validate requests and handle failures safely.

### Security

* HTTPS protects communication using TLS.
* CORS controls browser access to cross-origin responses.
* Authentication and authorization must be implemented separately from CORS.
* Never expose secrets or internal errors in responses.

### Performance

* Persistent connections reduce connection overhead.
* HTTP/2 supports multiplexing over TCP.
* HTTP/3 uses QUIC.
* Pagination and streaming help manage large payloads.
* Compression can reduce network transfer size.

---

## 16. Practical Implementations

The concepts above will be reinforced through small implementations using Node.js.

### Implementation 1: HTTP Request Inspector

**Objective:** Inspect HTTP requests and generate structured responses.

Requirements:

* [ ] Create a server using Node.js's built-in `http` module.
* [ ] Inspect request methods and URLs.
* [ ] Log request headers and the HTTP version.
* [ ] Return JSON responses.
* [ ] Set response headers and status codes.
* [ ] Test requests using `curl` or Postman.

Directory:

```text
01-http-inspector/
├── server.js
└── README.md
```

### Implementation 2: HTTP Statelessness Experiment

**Objective:** Understand the difference between independent HTTP requests and application-managed state.

Requirements:

* [ ] Build a simple request counter.
* [ ] Compare requests using an in-memory counter.
* [ ] Experiment with cookies or session identifiers.
* [ ] Document what the server remembers between requests.
* [ ] Explain how authentication state can be maintained.

Directory:

```text
02-http-statelessness/
├── server.js
└── README.md
```

### Implementation 3: HTTP vs HTTPS Lab

**Objective:** Observe the differences between plain HTTP and TLS-protected HTTP communication.

Requirements:

* [ ] Start a local HTTP server.
* [ ] Start a local HTTPS server using a development certificate.
* [ ] Send requests to both servers.
* [ ] Inspect the TLS certificate.
* [ ] Observe certificate validation failures.
* [ ] Document the purpose of the TLS handshake.

Directory:

```text
03-http-vs-https/
├── server.js
├── certs/
└── README.md
```

Use only local development certificates in this exercise. Never commit private keys, credentials, or production secrets.

---

## 17. Interview Questions

Use these questions to test your understanding after completing the implementations.

### Fundamentals

1. What is HTTP, and why is it considered an application-layer protocol?
2. Explain the HTTP request-response lifecycle.
3. Why is HTTP stateless?
4. How do cookies and sessions help maintain application state?
5. What are the main differences between HTTP/1.1, HTTP/2, and HTTP/3?

### Methods and Idempotency

6. What is the difference between `PUT` and `PATCH`?
7. What does it mean for an HTTP method to be safe?
8. What does idempotency mean?
9. Why is `DELETE` considered idempotent even if a repeated request returns `404`?
10. How can idempotency keys help prevent duplicate operations?

### Headers and Status Codes

11. What is the difference between `Accept` and `Content-Type`?
12. What is the difference between `401` and `403`?
13. When would you return `201`, `204`, or `202`?
14. What is the purpose of `Cache-Control`?
15. What happens when a server returns `429`?

### CORS and Security

16. What is CORS, and why do browsers enforce it?
17. What is a CORS preflight request?
18. Why does CORS not replace authentication?
19. What is the difference between HTTP and HTTPS?
20. What happens during a TLS handshake?

### Performance and Reliability

21. Why are persistent connections useful?
22. What is HTTP/2 multiplexing?
23. How does HTTP/3 differ from HTTP/2 at the transport layer?
24. What is chunked transfer encoding?
25. How do pagination, streaming, and compression improve backend performance?

---

## 📌 Learning Principle

> **Learn the concept. Rebuild it without notes. Test it. Explain it clearly. Repeat.**

Watching a tutorial introduces the concept. Implementing it from memory helps turn that concept into practical engineering knowledge.
