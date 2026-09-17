# 🍽️ Delirium — Restaurant Backend API

Production-oriented REST API for a restaurant ordering and payment platform.

**Node.js • TypeScript • Express 5 • PostgreSQL • Prisma • RabbitMQ • Razorpay • JWT • Docker**

Delirium is a backend for a real-world restaurant ordering workflow. Customers can browse the menu, manage a cart, place orders, make online payments, and track orders. Administrators can manage menu data and orders, update order status, cancel eligible orders, and trigger refund workflows.

The project is implemented as a **modular monolith** with production-oriented reliability patterns including database transactions, transactional outbox, RabbitMQ consumers, retries, dead-letter queues, webhook verification, idempotency, reconciliation, structured logging, authentication, authorization, and graceful shutdown.

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Application Flow](#-application-flow)
- [Authentication](#-authentication)
- [Menu Management](#-menu-management)
- [Cart Management](#-cart-management)
- [Order Management](#-order-management)
- [Payment System](#-payment-system)
- [Webhook Processing](#-webhook-processing)
- [RabbitMQ & Asynchronous Processing](#-rabbitmq--asynchronous-processing)
- [Transactional Outbox](#-transactional-outbox)
- [Retry & Dead Letter Queues](#-retry--dead-letter-queues)
- [Refund System](#-refund-system)
- [Database Design](#-database-design)
- [Role-Based Access Control](#-role-based-access-control)
- [Validation & Error Handling](#-validation--error-handling)
- [Logging & Request Tracing](#-logging--request-tracing)
- [Security](#-security)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [Docker & RabbitMQ](#-docker--rabbitmq)
- [Database Setup](#-database-setup)
- [Development Commands](#-development-commands)
- [Production Build](#-production-build)
- [Order Lifecycle](#-order-lifecycle)
- [Payment Lifecycle](#-payment-lifecycle)
- [Refund Lifecycle](#-refund-lifecycle)
- [Failure Handling](#-failure-handling)
- [Design Decisions](#-design-decisions)
- [Testing](#-testing)
- [Future Improvements](#-future-improvements)
- [License](#-license)
- [Author](#-author)

---

# 🚀 Project Overview

Delirium models the core backend workflow of a restaurant ordering platform.

A typical customer journey is:

```text
Register / Login
      ↓
Browse Menu
      ↓
Add Items to Cart
      ↓
Update Cart
      ↓
Create Order
      ↓
Initiate Razorpay Payment
      ↓
Complete Payment
      ↓
Payment Verification / Webhook
      ↓
Order Confirmation
      ↓
Restaurant Processes Order
      ↓
Preparing
      ↓
Ready
      ↓
Out for Delivery
      ↓
Delivered
```

For a paid order that is cancelled:

```text
Paid Order
    ↓
Cancellation Request
    ↓
Order → CANCELLED
    ↓
Refund → PENDING
    ↓
REFUND_REQUESTED Outbox Event
    ↓
RabbitMQ
    ↓
Refund Consumer
    ↓
Razorpay Refund API
    ↓
Refund → SUCCESS
```

The application separates synchronous API operations from asynchronous background processing.

---

# ✨ Key Features

## 👤 Authentication

- User registration
- User login
- JWT access tokens
- JWT refresh tokens
- Refresh token rotation
- Refresh token hashing
- Session tracking
- Logout
- Logout from all sessions
- Refresh token reuse detection
- Current-user endpoint
- Password hashing with Argon2

## 🔐 Authorization

Two application roles are supported:

```text
CUSTOMER
ADMIN
```

Customers can:

- Manage their cart
- Create orders
- View their orders
- Initiate payments
- Verify payments
- Cancel eligible orders

Admins can:

- Manage categories
- Manage menu items
- View all orders
- View individual orders
- Update order status
- Cancel eligible orders
- Participate in refund workflows

## 🍔 Menu

- Category management
- Menu item management
- Menu item availability
- Active/inactive menu items
- Admin-only menu mutations
- Public menu browsing

## 🛒 Cart

- Get cart
- Add item
- Update quantity
- Remove item
- Clear cart
- Menu-item availability validation
- Quantity validation
- Database uniqueness for cart/menu-item combinations

## 📦 Orders

- Create order from cart
- Order item price/name snapshots
- Customer order history
- Customer order details
- Admin order listing
- Admin order details
- Controlled order status transitions
- Customer cancellation for eligible orders
- Admin cancellation
- Transactional cancellation/refund workflow

## 💳 Payments

- Razorpay payment integration
- Payment creation
- Payment attempts
- Payment verification
- Signature verification
- Amount verification
- Gateway payment-status verification
- Payment-success order confirmation
- Webhook processing

## 🔔 Webhooks

- Razorpay webhook endpoint
- Raw request-body handling
- Webhook signature verification
- Webhook event persistence
- Duplicate webhook protection

## 🐇 RabbitMQ

- Asynchronous order confirmation
- Asynchronous refund processing
- Publisher confirms
- Consumer acknowledgements
- Consumer prefetch
- Retry queues
- Dead Letter Queues
- RabbitMQ reconnection/recovery handling

## 📤 Transactional Outbox

- Database-backed event persistence
- Outbox worker
- Event states
- Publisher confirms
- Retry handling
- Stale processing recovery
- Concurrent-safe event claiming

## 💸 Refunds

- Refund records
- Refund status tracking
- Refund idempotency
- Asynchronous refund processing
- Razorpay refund integration
- Refund reconciliation worker

## 📝 Observability

- Pino structured logging
- Request IDs
- AsyncLocalStorage-based request context
- Centralized error handling
- Health endpoint

## 🛡️ Security

- Argon2 password hashing
- JWT authentication
- Refresh token hashing
- Refresh token rotation
- Refresh token reuse detection
- Role-based access control
- Zod request validation
- CORS
- Rate limiting
- Razorpay webhook signature verification

---

# 🛠️ Technology Stack

## Backend

- **Node.js**
- **TypeScript**
- **Express 5**

## Database

- **PostgreSQL**
- **Prisma ORM**

## Authentication & Validation

- **JWT**
- **Argon2**
- **Zod**

## Messaging

- **RabbitMQ**
- **AMQP**

## Payments

- **Razorpay**

## Logging

- **Pino**
- **Pino Pretty**

## Infrastructure

- **Docker**
- **Docker Compose**

---

# 🏗️ Architecture

Delirium follows a **modular monolith** architecture.

The synchronous request flow is:

```text
Client
  ↓
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Prisma
  ↓
PostgreSQL
```

The asynchronous flow is:

```text
Database Transaction
        ↓
   Outbox Event
        ↓
 Outbox Publisher
        ↓
    RabbitMQ
        ↓
    Consumer
        ↓
    Service
        ↓
   Repository
        ↓
  PostgreSQL
```

This keeps business logic separated from HTTP concerns and database access while avoiding unnecessary microservice complexity.

---

# 🔄 Application Flow

## Synchronous API Flow

```text
HTTP Request
     ↓
Request ID Middleware
     ↓
Request Logger
     ↓
Authentication / Authorization
     ↓
Route
     ↓
Controller
     ↓
Service
     ↓
Repository
     ↓
Prisma
     ↓
PostgreSQL
     ↓
HTTP Response
```

## Asynchronous Event Flow

```text
Business Transaction
        ↓
PostgreSQL
        ↓
OutboxEvent
        ↓
Outbox Worker
        ↓
RabbitMQ
        ↓
Consumer
        ↓
Business Service
        ↓
PostgreSQL
```

---

# 🔐 Authentication

Authentication uses access tokens and refresh tokens.

Access tokens contain information such as:

```text
sub
role
```

Refresh tokens contain:

```text
sub
jti
```

Refresh tokens are hashed before being stored in the database.

## Refresh Token Rotation

```text
Old Refresh Token
       ↓
Validate JWT
       ↓
Find Session
       ↓
Compare Token Hash
       ↓
Rotate Refresh Token
       ↓
Generate New Refresh Token
```

If a previously rotated/revoked refresh token is reused, the application can detect the mismatch and revoke the relevant session.

---

# 🍔 Menu Management

The menu is organized as:

```text
Category
   │
   └── MenuItem
```

Menu items contain information such as:

- Name
- Description
- Price
- Image URL
- Active status
- Availability
- Category

Prices are stored as integer **paise**, not floating-point currency values.

For example:

```text
₹980
```

is represented as:

```text
98000 paise
```

This avoids floating-point precision issues in financial calculations.

---

# 🛒 Cart Management

Each authenticated customer can maintain a cart.

The cart supports:

```text
GET     /api/v1/cart
POST    /api/v1/cart/items
PATCH   /api/v1/cart/items/:id
DELETE  /api/v1/cart/items/:id
DELETE  /api/v1/cart
```

The application validates menu-item availability before adding items.

Cart item quantity is also validated against configured business limits.

A database uniqueness constraint prevents duplicate cart rows for the same menu item in the same cart.

---

# 📦 Order Management

When an order is created, the application validates the customer's cart and menu data inside a database transaction.

The order stores snapshots of important menu information.

For example:

```text
OrderItem
 ├── name
 ├── quantity
 └── unitPriceInPaise
```

This means an existing order remains historically accurate even if the menu item's name or price changes later.

Example:

```text
Today:
Paneer Tikka = ₹200

Customer places order.

Tomorrow:
Paneer Tikka = ₹250
```

The customer's existing order continues to represent the original ₹200 purchase price.

---

# 🔄 Order Status Lifecycle

Orders follow controlled transitions:

```text
PENDING
   ↓
CONFIRMED
   ↓
PREPARING
   ↓
READY
   ↓
OUT_FOR_DELIVERY
   ↓
DELIVERED
```

An order can also transition to:

```text
CANCELLED
```

when cancellation is permitted by the business rules.

The service prevents arbitrary invalid transitions such as:

```text
DELIVERED → PREPARING
```

or:

```text
CANCELLED → CONFIRMED
```

Order status updates use database-level conditional updates to reduce the risk of concurrent requests overwriting each other.

---

# 💳 Payment System

Online payment is implemented using Razorpay.

The payment domain contains:

```text
Payment
PaymentAttempt
```

A payment belongs to an order, while a payment can have multiple attempts.

This allows the system to represent payment retry scenarios without creating unrelated payment records for the same order.

---

# 💰 Payment Flow

```text
Customer
   │
   │ Create Order
   ▼
Order (PENDING)
   │
   │ Initiate Payment
   ▼
Razorpay Order
   │
   ▼
Payment Attempt
   │
   │ Customer completes payment
   ▼
Razorpay
   │
   ├───────────────┐
   │               │
   ▼               ▼
Verify API       Webhook
   │               │
   └───────┬───────┘
           ▼
     Payment SUCCESS
           │
           ▼
     Order CONFIRMED
```

Payment verification checks:

- Razorpay payment
- Razorpay order
- Signature
- Amount
- Gateway payment status

The backend does not simply trust client-provided payment information.

---

# 🔔 Webhook Processing

Razorpay webhooks are handled through a dedicated webhook endpoint.

```http
POST /api/v1/webhooks/razorpay
```

The route receives the raw request body because Razorpay webhook signature verification requires the original payload.

Webhook events are persisted so duplicate delivery can be detected.

A uniqueness constraint based on the provider and provider event ID prevents the same webhook event from being processed repeatedly.

---

# 🐇 RabbitMQ & Asynchronous Processing

RabbitMQ is used for workflows that benefit from asynchronous processing.

Important workflows include:

```text
Payment Success
      ↓
Order Confirmation
```

and:

```text
Refund Requested
      ↓
Refund Processing
```

The API does not need to keep an HTTP request open while the complete background workflow executes.

---

# 📤 Transactional Outbox Pattern

The application implements the **Transactional Outbox Pattern**.

Instead of relying on a database update and RabbitMQ publish operation to succeed together:

```text
Update Database
      ↓
Publish RabbitMQ Message
```

the application stores the event in PostgreSQL as part of the same database transaction.

Example:

```text
Database Transaction
 ├── Update Order
 ├── Update Payment
 └── Create OutboxEvent
```

If the transaction commits, the event exists durably in the database.

The Outbox Worker can then publish it to RabbitMQ.

---

# 🤔 Why the Outbox Pattern?

Consider:

```text
1. Database update succeeds
2. Application tries to publish RabbitMQ message
3. RabbitMQ connection fails
```

Without an outbox, the event may be lost.

With the outbox:

```text
Database Transaction
       ↓
OutboxEvent stored
       ↓
Transaction commits
       ↓
RabbitMQ temporarily unavailable
       ↓
Outbox Worker retries later
```

The event remains available until it can be published.

---

# 🔄 Outbox Processing

Outbox events use processing states such as:

```text
PENDING
PROCESSING
PUBLISHED
FAILED
```

The worker claims events using database locking and:

```sql
FOR UPDATE SKIP LOCKED
```

This helps multiple workers/processes safely process different events without selecting the same row simultaneously.

Stale `PROCESSING` events can also be recovered if a worker crashes during processing.

RabbitMQ publisher confirms are used to determine whether the broker accepted a published message.

---

# 🔁 Retry & Dead Letter Queues

The messaging system uses delayed retry queues.

The configured retry delays are:

```text
5 seconds
30 seconds
120 seconds
```

Conceptually:

```text
Main Queue
    │
    ▼
Consumer
    │
    ├── Success → ACK
    │
    └── Failure
          ↓
       Retry 5s
          ↓
       Retry 30s
          ↓
       Retry 120s
          ↓
         DLQ
```

The system also has a maximum retry limit.

Messages that cannot be processed after the configured number of attempts are moved to a Dead Letter Queue.

---

# ☠️ Dead Letter Queues

Important asynchronous workflows have dedicated DLQs.

Examples include:

```text
order confirmation DLQ
refund processing DLQ
```

DLQs prevent permanently failing messages from being retried forever.

They also provide an operational place to inspect failed events.

---

# 💸 Refund System

Refunds are represented through a dedicated `Refund` entity.

A refund tracks information such as:

- Payment
- Amount
- Status
- Razorpay refund ID
- Razorpay payment ID
- Reason
- Idempotency key
- Timestamps

Typical states are:

```text
PENDING
   ↓
PROCESSING
   ↓
SUCCESS
```

or:

```text
PROCESSING
   ↓
FAILED
```

---

# 🔐 Refund Idempotency

Refund processing uses an idempotency key.

This is important because distributed systems can experience:

```text
Network Timeout
     ↓
Retry
     ↓
Duplicate Message
     ↓
Consumer Restart
```

Without idempotency, the same logical refund could potentially be attempted more than once.

A database uniqueness constraint protects the idempotency key.

---

# 🔄 Refund Processing Flow

For a paid order that is cancelled:

```text
Customer/Admin
      │
      ▼
Cancellation Request
      │
      ▼
Database Transaction
      │
      ├── Order → CANCELLED
      │
      ├── Refund → PENDING
      │
      └── OutboxEvent → REFUND_REQUESTED
                 │
                 ▼
             RabbitMQ
                 │
                 ▼
          Refund Consumer
                 │
                 ▼
          Razorpay Refund API
                 │
                 ▼
          Refund SUCCESS
```

The external Razorpay call is kept outside the database transaction.

This prevents a slow or unavailable payment gateway from holding an open database transaction.

---

# 🔍 Refund Reconciliation

A refund reconciliation worker is started with the application.

Its purpose is to recover from situations where local database state and the external payment gateway can temporarily disagree.

For example:

```text
Database:
Refund = PROCESSING

Gateway:
Refund = SUCCESS
```

A reconciliation process can detect such inconsistencies and bring the local state back in line with the gateway.

---

# 🗄️ Database Design

The project uses:

```text
PostgreSQL
      +
Prisma ORM
```

Major domain entities include:

```text
User
Session

Category
MenuItem

Cart
CartItem

Order
OrderItem

Payment
PaymentAttempt

Refund

OutboxEvent
WebhookEvent
```

---

# 🧩 Entity Relationships

High-level relationship structure:

```text
User
 │
 ├── Session
 │
 ├── Cart
 │     └── CartItem
 │            └── MenuItem
 │
 └── Order
       ├── OrderItem
       │     └── MenuItem
       │
       └── Payment
             ├── PaymentAttempt
             └── Refund


Category
   │
   └── MenuItem


OutboxEvent

WebhookEvent
```

---

# 👮 Role-Based Access Control

The authorization flow is:

```text
Request
   ↓
Authentication
   ↓
Identify User
   ↓
Authorization
   ↓
Check Role
   ↓
Controller
```

For admin-only functionality:

```text
requireAuth
     ↓
requireRole("ADMIN")
```

This keeps authentication and authorization concerns separated.

---

# 🧪 Validation

Incoming request data is validated using **Zod**.

Validation occurs before business logic is executed.

Examples include validation for:

- Authentication requests
- Menu requests
- Cart requests
- Order requests
- Payment requests
- Refund requests
- Route parameters
- Query parameters

This keeps API contracts explicit and prevents malformed input from reaching deeper application layers.

---

# ❌ Centralized Error Handling

The application uses centralized error middleware.

Application-specific errors are represented using `AppError`.

This allows business logic to communicate:

```text
HTTP Status
Error Code
Message
```

without duplicating response formatting throughout controllers.

---

# 📝 Logging & Request Tracing

Structured logging is implemented using **Pino**.

The application generates request IDs and uses request context to associate logs with the request that produced them.

Conceptually:

```text
HTTP Request
     ↓
Request ID
     ↓
Request Context
     ↓
Structured Logs
```

This is especially useful when debugging a workflow that crosses:

```text
API
 ↓
Database
 ↓
Outbox
 ↓
RabbitMQ
 ↓
Consumer
 ↓
Payment/Refund Gateway
```

---

# 🛡️ Security

The backend contains multiple security mechanisms.

## Password Hashing

Passwords are hashed using:

```text
Argon2
```

Plaintext passwords are not stored.

## JWT Authentication

Separate access-token and refresh-token secrets are configured.

## Refresh Token Hashing

Refresh tokens are hashed before database storage.

## Refresh Token Rotation

Refresh tokens are rotated during refresh operations.

## Refresh Token Reuse Detection

Unexpected reuse of a rotated refresh token can trigger session revocation.

## Role-Based Authorization

Administrative operations require the `ADMIN` role.

## Input Validation

Zod validates incoming data.

## CORS

CORS is configured at the application layer.

## Rate Limiting

API traffic is protected with rate limiting.

## Webhook Signature Verification

Razorpay webhook signatures are verified before processing webhook events.

---

# 📂 Project Structure

A simplified project structure is:

```text
src/
│
├── config/
│   └── env.ts
│
├── errors/
│   ├── AppError.ts
│   ├── errorCodes.ts
│   └── prismaErrorMapper.ts
│
├── lib/
│   ├── jwt.ts
│   ├── logger.ts
│   ├── password.ts
│   ├── token.ts
│   ├── prisma.ts
│   └── rabbitmq.ts
│
├── middlewares/
│   ├── auth.middleware.ts
│   ├── authorization.middleware.ts
│   ├── error.middleware.ts
│   ├── rateLimit.middleware.ts
│   ├── requestId.middleware.ts
│   └── requestLogger.middleware.ts
│
├── modules/
│   │
│   ├── auth/
│   ├── menu/
│   ├── cart/
│   ├── order/
│   ├── payment/
│   └── outbox/
│
├── routes/
│   └── index.ts
│
├── app.ts
└── server.ts
```

The module directories contain the relevant:

```text
routes
controllers
services
repositories
schemas
types
consumers
workers
```

depending on the module.

---

# 📡 API Endpoints

The API is versioned under:

```text
/api/v1
```

> Exact request/response schemas should be checked against the current route and Zod schema files in the repository.

---

## Authentication

### Register

```http
POST /api/v1/auth/register
```

### Login

```http
POST /api/v1/auth/login
```

### Refresh Token

```http
POST /api/v1/auth/refresh
```

### Logout

```http
POST /api/v1/auth/logout
```

### Logout All Sessions

```http
POST /api/v1/auth/logout-all
```

### Current User

```http
GET /api/v1/auth/me
```

---

## Menu / Categories

Typical category operations:

```http
GET    /api/v1/menu/categories
GET    /api/v1/menu/categories/:id
POST   /api/v1/menu/categories
PATCH  /api/v1/menu/categories/:id
DELETE /api/v1/menu/categories/:id
```

Admin-only operations require authentication and the `ADMIN` role.

---

## Menu Items

```http
GET    /api/v1/menu
GET    /api/v1/menu/:id
POST   /api/v1/menu
PATCH  /api/v1/menu/:id
DELETE /api/v1/menu/:id
```

Admin-only operations require the appropriate authorization.

---

## Cart

```http
GET    /api/v1/cart
POST   /api/v1/cart/items
PATCH  /api/v1/cart/items/:id
DELETE /api/v1/cart/items/:id
DELETE /api/v1/cart
```

Authentication is required.

---

## Customer Orders

```http
POST /api/v1/order
GET  /api/v1/order
GET  /api/v1/order/:id
```

Authentication is required.

---

## Admin Orders

```http
GET   /api/v1/admin/order
GET   /api/v1/admin/order/:id
PATCH /api/v1/admin/order/:id/status
POST  /api/v1/admin/order/:id/cancel
```

Admin authentication is required.

---

## Payments

```http
POST /api/v1/payment/order/:orderId
POST /api/v1/payment/verify
```

Authentication is required.

---

## Razorpay Webhook

```http
POST /api/v1/webhooks/razorpay
```

The webhook endpoint is handled separately from the normal JSON parsing middleware because signature verification requires the raw request body.

---

## Health Check

```http
GET /health
```

Used to determine whether the application process is responding.

---

# ⚙️ Environment Variables

Create a `.env` file in the backend project root.

Example:

```env
NODE_ENV=development

PORT=3000

DATABASE_URL=postgresql://postgres:password@localhost:5432/delirium

RABBITMQ_URL=amqp://delirium:delirium_dev_password@localhost:5672

LOG_LEVEL=info

JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret

JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=7d

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

The actual environment schema in the repository is the source of truth for required variables.

### ⚠️ Never commit secrets

Do not commit:

```text
.env
```

or real:

```text
JWT secrets
Razorpay secrets
Database passwords
RabbitMQ passwords
```

to GitHub.

---

# 🏁 Getting Started

## Prerequisites

Install:

- Node.js
- npm
- Docker Desktop
- PostgreSQL
- Git

For payment testing, a Razorpay test account and test credentials are also required.

---

## 1. Clone the Repository

```bash
git clone <your-repository-url>
```

Then enter the backend directory:

```bash
cd backend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment

Create:

```text
.env
```

and configure the required environment variables.

---

## 4. Start Infrastructure

If using the included Docker Compose configuration:

```bash
docker compose up -d
```

---

## 5. Generate Prisma Client

Use the database generation script defined in `package.json`.

Typically:

```bash
npm run db:generate
```

---

## 6. Run Database Migrations

Use the migration script defined in `package.json`.

Typically:

```bash
npm run db:migrate
```

---

## 7. Start Development Server

```bash
npm run dev
```

The server runs on the configured port.

Typical local address:

```text
http://localhost:3000
```

---

# 🐳 Docker & RabbitMQ

RabbitMQ is included as part of the local infrastructure.

Start containers:

```bash
docker compose up -d
```

Check running containers:

```bash
docker ps
```

Stop containers:

```bash
docker compose down
```

RabbitMQ commonly exposes:

```text
AMQP:      5672
Management: 15672
```

The exact credentials are defined by the local Docker configuration.

---

# 🗄️ Database Setup

The application uses PostgreSQL through Prisma.

Typical development workflow:

```bash
npm install
npm run db:generate
npm run db:migrate
npm run dev
```

The Prisma schema and migration files are the source of truth for the database structure.

---

# 🧑‍💻 Development Commands

The exact commands are defined in `package.json`.

Common commands include:

```bash
npm run dev
```

Start the development server.

```bash
npm run build
```

Compile the TypeScript application.

```bash
npm start
```

Run the production build.

```bash
npm run typecheck
```

Run TypeScript type checking.

```bash
npm run db:generate
```

Generate the Prisma client.

```bash
npm run db:migrate
```

Run development database migrations.

---

# 🏭 Production Build

Build the application:

```bash
npm run build
```

Then start the compiled application:

```bash
npm start
```

The production build is generated from the TypeScript source.

---

# 🔄 Order Lifecycle

The primary order lifecycle is:

```text
PENDING
   │
   │ Successful Payment
   ▼
CONFIRMED
   │
   ▼
PREPARING
   │
   ▼
READY
   │
   ▼
OUT_FOR_DELIVERY
   │
   ▼
DELIVERED
```

Cancellation is represented by:

```text
CANCELLED
```

The order service enforces valid state transitions.

For customer cancellation, the application checks the current order state and business rules before allowing the cancellation.

---

# 💳 Payment Lifecycle

A payment can progress through states such as:

```text
PENDING
   │
   ├── SUCCESS
   │
   └── FAILED
```

A successful payment results in the appropriate order-confirmation workflow.

Payment attempts are maintained separately, allowing failed attempts to be represented without losing payment history.

---

# 💸 Refund Lifecycle

Refunds typically follow:

```text
PENDING
   ↓
PROCESSING
   ↓
SUCCESS
```

or:

```text
PROCESSING
   ↓
FAILED
```

Refund processing is asynchronous and uses RabbitMQ.

---

# 🚨 Failure Handling

The backend is designed to handle common real-world failure scenarios.

## RabbitMQ Unavailable

RabbitMQ connection recovery/reconnection logic attempts to recover the messaging connection.

## Consumer Processing Failure

Failed messages are sent through retry queues.

```text
5s → 30s → 120s → DLQ
```

## Consumer Crash

Messages that are not acknowledged can be redelivered by RabbitMQ.

## Application Crash During Outbox Processing

Outbox events are stored in PostgreSQL and can be recovered if processing was interrupted.

## Duplicate Webhook

Webhook event IDs are persisted with uniqueness protection.

## Duplicate Refund Request

Refund idempotency keys prevent duplicate logical refund creation.

## Concurrent Order Update

Conditional database updates reduce the risk of silently overwriting a newer order state.

## External Payment Gateway Failure

Razorpay calls are kept outside critical database transactions where appropriate, preventing an external dependency from unnecessarily holding database locks.

---

# 🧠 Design Decisions

## Modular Monolith

The application uses a modular monolith rather than immediately splitting the system into microservices.

Domain boundaries are represented through modules:

```text
Auth
Menu
Cart
Order
Payment
Outbox
```

This provides separation without introducing unnecessary operational complexity.

---

## Why RabbitMQ?

RabbitMQ is used for operations that are naturally asynchronous:

```text
Payment Success
      ↓
Order Confirmation
```

and:

```text
Refund Requested
      ↓
Refund Processing
```

It also provides mechanisms for acknowledgements, retries, and dead-letter handling.

---

## Why Transactional Outbox?

The outbox pattern addresses the consistency problem between:

```text
Database
```

and:

```text
Message Broker
```

The event is first made durable in the same database transaction as the business state change.

---

## Why Integer Paise?

Financial values are represented as integers.

For example:

```text
₹100.50
```

becomes:

```text
10050
```

This avoids floating-point precision problems.

---

## Why Order Snapshots?

An order should represent what the customer purchased at the time of purchase.

Therefore, important menu information is copied into the order item.

This protects historical order data from later menu changes.

---

## Why Hash Refresh Tokens?

Refresh tokens are sensitive authentication credentials.

Storing their hashes instead of plaintext tokens reduces the impact of a database exposure.

---

## Why Keep External Calls Outside Transactions?

External services can be slow or unavailable.

Holding a PostgreSQL transaction open while waiting for Razorpay can:

- Increase lock duration
- Reduce database throughput
- Increase contention
- Make failures harder to recover from

Therefore, gateway calls are separated from critical database transactions and coordinated using durable state and asynchronous processing where appropriate.

---

# 🧪 Testing Strategy

A production backend should be tested at multiple levels.

## Unit Tests

Examples:

```text
Order state transitions
Cart quantity validation
Authentication rules
Refund business logic
Payment verification
```

## Integration Tests

Test interactions between:

```text
Service
Repository
PostgreSQL
```

## Messaging Tests

Test:

```text
Outbox
RabbitMQ
Consumers
Retry
DLQ
```

## Payment Tests

Use Razorpay test credentials to verify:

```text
Payment creation
Payment verification
Webhook processing
Refund processing
```

---

# 📊 Production-Oriented Characteristics

This project focuses on more than basic CRUD operations.

Important backend engineering concepts demonstrated include:

```text
REST API Design
        +
Layered Architecture
        +
Modular Monolith
        +
Authentication
        +
Authorization
        +
JWT Refresh Token Rotation
        +
Session Management
        +
PostgreSQL
        +
Prisma
        +
Database Transactions
        +
Payment Gateway Integration
        +
Webhook Verification
        +
RabbitMQ
        +
Transactional Outbox
        +
Publisher Confirms
        +
Message Retries
        +
Dead Letter Queues
        +
Idempotency
        +
Refund Processing
        +
Reconciliation
        +
Structured Logging
        +
Request Correlation
        +
Rate Limiting
        +
Graceful Shutdown
```

---

# 🚫 Current Scope

The project intentionally remains a modular monolith.

It does **not** currently depend on:

- Kafka
- Redis
- Kubernetes
- Microservices
- Elasticsearch
- GraphQL
- CQRS
- Event Sourcing

RabbitMQ is used where asynchronous processing provides a clear benefit.

These technologies can be introduced later if actual scale or requirements justify them.

---

# 🔮 Future Improvements

Potential future improvements include:

- Comprehensive unit test coverage
- Integration test suite
- End-to-end API tests
- OpenAPI/Swagger documentation
- More complete pagination
- Application metrics
- Distributed tracing
- CI/CD pipeline
- Automated database backup strategy
- Production Docker image
- More advanced monitoring
- Improved readiness checks
- Additional payment reconciliation
- Operational tooling for DLQ inspection/replay
- API performance testing
- Load testing

The goal is to add infrastructure only when it solves a real requirement.

---

# 🛑 Graceful Shutdown

The server handles process termination signals such as:

```text
SIGTERM
SIGINT
```

During shutdown, the application attempts to stop accepting new requests and close background resources cleanly.

This is important for Docker and production environments where applications can receive termination signals during deployments or restarts.

---

# 📜 License

This project is currently intended as a personal/portfolio project.

If you decide to publish it as open source, add an appropriate license such as MIT, Apache-2.0, or another license that matches your intended usage.

---

# 👨‍💻 Author

**Saurabh**

Backend engineering project focused on building a production-oriented restaurant ordering system.

### Core technologies

```text
Node.js
TypeScript
Express 5
PostgreSQL
Prisma
RabbitMQ
Razorpay
JWT
Argon2
Zod
Pino
Docker
```

---

# ⭐ Project Highlights

Delirium demonstrates how a backend can go beyond simple CRUD APIs and handle real-world application concerns.

The most important engineering areas covered by the project are:

```text
┌──────────────────────────────────────────────┐
│              DELIRIUM BACKEND                │
├──────────────────────────────────────────────┤
│                                              │
│  Authentication & Authorization              │
│  PostgreSQL + Prisma                         │
│  Restaurant Menu & Cart                      │
│  Order Lifecycle Management                  │
│  Razorpay Payment Integration                │
│  Webhook Verification                        │
│  Transactional Outbox                        │
│  RabbitMQ                                    │
│  Retry Queues                                │
│  Dead Letter Queues                          │
│  Idempotent Refund Processing                │
│  Refund Reconciliation                       │
│  Structured Logging                          │
│  Request Correlation                         │
│  Rate Limiting                               │
│  Graceful Shutdown                           │
│  Failure Recovery                            │
│                                              │
└──────────────────────────────────────────────┘
```

The overall goal is to build a backend that is:

**Reliable • Maintainable • Secure • Observable • Failure-aware • Production-oriented**
