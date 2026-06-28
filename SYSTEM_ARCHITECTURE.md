# CampusOS — System Architecture

## Document Info

| Field | Value |
|-------|-------|
| **Product** | CampusOS — Smart Campus Platform |
| **Version** | 1.0 (Phase 1) |
| **Status** | Draft |

---

## 1. Architecture Overview

CampusOS follows a **three-tier architecture**: a React SPA frontend, a Node.js/Express REST API, and a PostgreSQL database. Authentication is stateless via JWT. The system is modular by domain (auth, cart, orders, stationery, canteen, printout, admin) to allow independent evolution of each service.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT TIER                                   │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │              React + Vite + Tailwind (SPA)                        │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │  │
│  │  │  Auth    │ │  Cart &  │ │ Service  │ │ Admin Dashboard  │   │  │
│  │  │  Pages   │ │  Orders  │ │  Modules │ │ & QR Scanner     │   │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS / REST JSON
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          APPLICATION TIER                               │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    Node.js + Express API                          │  │
│  │  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌─────────────────────────┐ │  │
│  │  │  Auth   │ │   Cart   │ │ Orders  │ │   Service Modules       │ │  │
│  │  │ Module  │ │  Module  │ │ Module  │ │ Stat │ Cant │ Print    │ │  │
│  │  └─────────┘ └──────────┘ └─────────┘ └─────────────────────────┘ │  │
│  │  ┌─────────┐ ┌──────────┐ ┌─────────┐                              │  │
│  │  │   QR    │ │  Admin   │ │  File   │                              │  │
│  │  │ Module  │ │  Module  │ │ Storage │                              │  │
│  │  └─────────┘ └──────────┘ └─────────┘                              │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ SQL (parameterized)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            DATA TIER                                    │
│  ┌──────────────────────┐    ┌──────────────────────┐                  │
│  │     PostgreSQL       │    │   File System        │                  │
│  │  (users, orders,     │    │  (print uploads)     │                  │
│  │   catalogs, carts)   │    │                      │                  │
│  └──────────────────────┘    └──────────────────────┘                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 | UI components and state |
| | Vite | Build tool and dev server |
| | Tailwind CSS | Utility-first styling |
| | React Router | Client-side routing |
| | Axios or fetch | HTTP client |
| **Backend** | Node.js | Runtime |
| | Express | HTTP server and routing |
| | jsonwebtoken | JWT creation and verification |
| | bcrypt | Password hashing |
| | multer | File upload handling |
| | pg / node-pg or Prisma | PostgreSQL access |
| **Database** | PostgreSQL 15+ | Primary data store |
| **Auth** | JWT (access + refresh) | Stateless authentication |
| **QR** | qrcode (server) + qrcode.react (client) | Generation and display |
| **DevOps** | Docker Compose | Local PostgreSQL |
| | dotenv | Environment configuration |

---

## 3. System Components

### 3.1 Frontend Application

Single SPA with role-based route guards.

```
frontend/src/
├── main.jsx
├── App.jsx
├── routes/
│   ├── PublicRoutes.jsx        # Login, Register
│   ├── StudentRoutes.jsx       # Catalogs, Cart, Orders, QR display
│   ├── StaffRoutes.jsx         # Fulfillment queues, QR scanner
│   └── AdminRoutes.jsx         # Dashboard, CRUD, reports
├── pages/
│   ├── auth/
│   ├── stationery/
│   ├── canteen/
│   ├── printout/
│   ├── cart/
│   ├── orders/
│   └── admin/
├── components/
│   ├── layout/                 # Navbar, Sidebar, Footer
│   ├── cart/                   # CartDrawer, CartItem
│   ├── orders/                 # OrderCard, OrderStatusBadge
│   ├── qr/                     # QRDisplay, QRScanner
│   └── ui/                     # Button, Input, Modal, Table
├── context/
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── hooks/
│   ├── useAuth.js
│   └── useApi.js
└── services/
    └── api.js                  # Axios instance with interceptors
```

**Key frontend patterns:**
- `AuthContext` holds user, tokens, and role; provides login/logout
- `CartContext` syncs with server cart; optimistic updates optional
- Protected routes redirect unauthenticated users to login
- Role-based rendering: `student`, `staff`, `admin` see different nav items
- QR scanner uses `getUserMedia` for staff pickup flow

---

### 3.2 Backend API

RESTful API organized by domain modules.

```
backend/src/
├── index.js                    # App entry, middleware, route mounting
├── config/
│   ├── database.js
│   └── env.js
├── middleware/
│   ├── auth.js                 # JWT verification
│   ├── roleGuard.js            # Role-based access
│   ├── errorHandler.js
│   └── validate.js             # Request validation
├── modules/
│   ├── auth/
│   │   ├── auth.routes.js
│   │   ├── auth.controller.js
│   │   ├── auth.service.js
│   │   └── auth.repository.js
│   ├── cart/
│   ├── orders/
│   ├── qr/
│   ├── stationery/
│   ├── canteen/
│   ├── printout/
│   └── admin/
└── utils/
    ├── jwt.js
    ├── qr.js
    └── pagination.js
```

**Module responsibilities:**

| Module | Responsibility |
|--------|----------------|
| **auth** | Register, login, refresh, logout, password management |
| **cart** | CRUD cart items, validation, totals |
| **orders** | Checkout, status transitions, history, cancellation |
| **qr** | Token generation, verification, expiry |
| **stationery** | Product catalog, categories, stock |
| **canteen** | Menu, time slots, availability |
| **printout** | Upload, pricing, print queue |
| **admin** | Aggregated views, user management, reports |

Each module follows: **routes → controller → service → repository** layering.

---

## 4. API Design

### 4.1 Base URL

```
/api/v1
```

### 4.2 Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Create account |
| POST | `/auth/login` | Public | Login, return tokens |
| POST | `/auth/refresh` | Public | Refresh access token |
| POST | `/auth/logout` | User | Revoke refresh token |
| GET | `/auth/me` | User | Current user profile |

### 4.3 Cart Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/cart` | User | Get current cart |
| POST | `/cart/items` | User | Add item |
| PATCH | `/cart/items/:id` | User | Update quantity/options |
| DELETE | `/cart/items/:id` | User | Remove item |
| DELETE | `/cart` | User | Clear cart |

### 4.4 Order Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/orders/checkout` | User | Convert cart to orders |
| GET | `/orders` | User | List own orders |
| GET | `/orders/:id` | User | Order detail + QR data |
| PATCH | `/orders/:id/cancel` | User | Cancel pending order |
| GET | `/orders/queue` | Staff | Service queue (filtered by role) |
| PATCH | `/orders/:id/status` | Staff | Update order status |

### 4.5 QR Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/orders/:id/qr` | User | Get QR payload for order |
| POST | `/qr/verify` | Staff | Verify pickup token |

### 4.6 Service Endpoints (Representative)

**Stationery:**
- `GET /stationery/products` — List products
- `GET /stationery/products/:id` — Product detail
- `GET /stationery/categories` — List categories
- Admin CRUD: `POST/PATCH/DELETE /admin/stationery/products`

**Canteen:**
- `GET /canteen/menu` — Menu with availability
- `GET /canteen/slots` — Available time slots
- Admin CRUD: `POST/PATCH/DELETE /admin/canteen/items`

**Printout:**
- `POST /printout/upload` — Upload file, return file ID + page count
- `POST /printout/estimate` — Price estimate for options
- Staff: `GET /printout/queue` — Print job queue

### 4.7 Admin Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/dashboard` | Admin | Summary stats |
| GET | `/admin/orders` | Admin | All orders with filters |
| GET | `/admin/users` | Admin | User list |
| PATCH | `/admin/users/:id` | Admin | Update role/status |
| GET | `/admin/reports/daily` | Admin | Daily summary |

### 4.8 Standard Response Format

**Success:**
```json
{
  "success": true,
  "data": { }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": []
  }
}
```

**HTTP status codes:** 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 500 Internal Server Error.

---

## 5. Authentication Architecture

### 5.1 JWT Flow

```
┌────────┐                              ┌─────────┐
│ Client │                              │   API   │
└───┬────┘                              └────┬────┘
    │  POST /auth/login {email, password}      │
    │─────────────────────────────────────────►│
    │                                          │ Verify bcrypt hash
    │  { accessToken, refreshToken }           │ Store refresh token hash in DB
    │◄─────────────────────────────────────────│
    │                                          │
    │  GET /api/... Authorization: Bearer AT   │
    │─────────────────────────────────────────►│
    │                                          │ Verify JWT signature + expiry
    │  200 { data }                            │
    │◄─────────────────────────────────────────│
    │                                          │
    │  (access token expires)                  │
    │  POST /auth/refresh { refreshToken }     │
    │─────────────────────────────────────────►│
    │  { accessToken, refreshToken }           │ Rotate refresh token
    │◄─────────────────────────────────────────│
```

### 5.2 Token Configuration

| Token | TTL | Payload |
|-------|-----|---------|
| Access | 15 minutes | `{ sub, email, role }` |
| Refresh | 7 days | `{ sub, jti }` (stored hashed in DB) |

### 5.3 Middleware Chain

```
Request → cors → json parser → auth (optional) → roleGuard → controller → errorHandler
```

---

## 6. Database Architecture

### 6.1 Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    users     │       │    carts     │       │  cart_items  │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │──1:1──│ id (PK)      │──1:N──│ id (PK)      │
│ email        │       │ user_id (FK) │       │ cart_id (FK) │
│ password_hash│       │ updated_at   │       │ service_type │
│ name         │       └──────────────┘       │ reference_id │
│ campus_id    │                              │ quantity     │
│ role         │                              │ options      │
│ active       │                              │ unit_price   │
└──────┬───────┘                              └──────────────┘
       │
       │ 1:N
       ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────────┐
│    orders    │──1:N──│ order_items  │       │ order_status_    │
├──────────────┤       ├──────────────┤       │ history          │
│ id (PK)      │       │ id (PK)      │       ├──────────────────┤
│ order_number │       │ order_id(FK) │       │ id (PK)          │
│ user_id (FK) │       │ name         │       │ order_id (FK)    │
│ service_type │       │ quantity     │       │ status           │
│ status       │       │ unit_price   │       │ changed_by (FK)  │
│ total        │       │ options      │       │ changed_at       │
│ pickup_token │       └──────────────┘       └──────────────────┘
│ created_at   │
└──────────────┘

┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
│ stationery_products│  │  canteen_menu_items│  │     print_jobs     │
├────────────────────┤  ├────────────────────┤  ├────────────────────┤
│ id (PK)            │  │ id (PK)            │  │ id (PK)            │
│ category_id (FK)   │  │ category_id (FK)   │  │ user_id (FK)       │
│ name, price, stock  │  │ name, price        │  │ file_path          │
│ image_url, active  │  │ available          │  │ page_count         │
└─────────┬──────────┘  │ meal_periods       │  │ options, price     │
          │             └─────────┬──────────┘  └────────────────────┘
          ▼                       ▼
┌────────────────────┐  ┌────────────────────┐
│ stationery_        │  │ canteen_categories │
│ categories         │  └────────────────────┘
└────────────────────┘

┌────────────────────┐
│  refresh_tokens    │
├────────────────────┤
│ id (PK)            │
│ user_id (FK)       │
│ token_hash         │
│ expires_at         │
└────────────────────┘
```

### 6.2 Key Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| users | `email` (unique) | Login lookup |
| orders | `user_id`, `status`, `service_type` | User history, staff queues |
| orders | `order_number` (unique) | Display reference |
| orders | `pickup_token` (unique) | QR verification |
| cart_items | `cart_id` | Cart retrieval |
| stationery_products | `category_id`, `active` | Catalog browsing |

### 6.3 Migration Strategy

- Sequential numbered SQL migrations (e.g., `001_initial_schema.sql`)
- Migrations run on deploy via npm script
- No manual schema changes in production

---

## 7. Core Workflows

### 7.1 Checkout Flow

```
Student                Cart Service           Order Service          QR Service
   │                        │                      │                    │
   │ POST /orders/checkout  │                      │                    │
   │───────────────────────►│                      │                    │
   │                        │ Validate cart items  │                    │
   │                        │ (stock, slots, etc.) │                    │
   │                        │─────────────────────►│                    │
   │                        │                      │ Group by service     │
   │                        │                      │ Create order(s)      │
   │                        │                      │ Decrement stock      │
   │                        │                      │ Clear cart           │
   │                        │                      │───────────────────►│
   │                        │                      │                    │ Generate pickup_token
   │                        │                      │◄───────────────────│
   │  { orders: [...] }     │                      │                    │
   │◄───────────────────────│                      │                    │
```

### 7.2 QR Pickup Flow

```
Student (QR display)              Staff (Scanner)                API
        │                                │                         │
        │  Shows QR with pickup_token    │                         │
        │                                │ POST /qr/verify         │
        │                                │ { token }               │
        │                                │────────────────────────►│
        │                                │                         │ Lookup order by token
        │                                │                         │ Validate not expired/used
        │                                │                         │ Set status = picked_up
        │                                │  { order, success }     │
        │                                │◄────────────────────────│
        │  (optional: poll order status) │                         │
```

### 7.3 Printout Upload Flow

```
Student                    API                     File System          DB
   │                        │                          │                │
   │ POST /printout/upload  │                          │                │
   │ (multipart file)       │                          │                │
   │───────────────────────►│                          │                │
   │                        │ Validate type/size       │                │
   │                        │─────────────────────────►│ Save file      │
   │                        │                          │                │
   │                        │ Extract page count       │                │
   │                        │──────────────────────────────────────────►│
   │                        │                          │   print_jobs   │
   │  { fileId, pages }     │                          │                │
   │◄───────────────────────│                          │                │
   │                        │                          │                │
   │ POST /cart/items       │                          │                │
   │ { printout config }    │                          │                │
   │───────────────────────►│                          │                │
```

---

## 8. Security Architecture

| Concern | Mitigation |
|---------|------------|
| **Authentication** | JWT with short TTL; refresh token rotation |
| **Authorization** | Role middleware on every protected route |
| **Password storage** | bcrypt with cost ≥ 10 |
| **SQL injection** | Parameterized queries only |
| **XSS** | React auto-escaping; sanitize rich text if added later |
| **CSRF** | Not required for Bearer token API; SameSite cookies if cookie auth added |
| **File uploads** | Whitelist MIME types; size limit; store outside web root |
| **Rate limiting** | express-rate-limit on auth and upload endpoints |
| **CORS** | Restrict to frontend origin in production |

---

## 9. Deployment Architecture (Phase 1)

### 9.1 Local Development

```
docker-compose.yml
├── postgres:15 (port 5432)
│
backend (port 3000)  ←→  postgres
frontend (port 5173)  →  backend (proxy or CORS)
```

### 9.2 Staging / Production (Recommended)

```
                    ┌─────────────┐
   Users ──────────►│   Nginx     │
   (HTTPS)          │  Reverse    │
                    │   Proxy     │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼                         ▼
     ┌────────────────┐        ┌────────────────┐
     │  Static Files  │        │  Node.js API   │
     │  (Vite build)  │        │  (Express)     │
     └────────────────┘        └───────┬────────┘
                                       │
                              ┌────────┴────────┐
                              ▼                 ▼
                     ┌──────────────┐  ┌──────────────┐
                     │  PostgreSQL  │  │ Upload Volume│
                     └──────────────┘  └──────────────┘
```

### 9.3 Environment Variables

| Variable | Component | Description |
|----------|-----------|-------------|
| `DATABASE_URL` | Backend | PostgreSQL connection string |
| `JWT_SECRET` | Backend | Signing key for access tokens |
| `JWT_REFRESH_SECRET` | Backend | Signing key for refresh tokens |
| `UPLOAD_DIR` | Backend | Path for print file storage |
| `CORS_ORIGIN` | Backend | Allowed frontend origin |
| `PORT` | Backend | API port (default 3000) |
| `VITE_API_URL` | Frontend | Backend base URL |

---

## 10. Cross-Cutting Concerns

### 10.1 Error Handling

- Controllers throw typed errors (`AppError` with code and status)
- Global error handler maps to consistent JSON response
- Log errors server-side; never expose internals to client

### 10.2 Validation

- Request body validation at route level (e.g., Zod or express-validator)
- Business rule validation in service layer (stock, slots, status transitions)

### 10.3 Logging

- Structured JSON logs in production (method, path, status, duration, userId)
- Request ID for tracing

### 10.4 Order Number Generation

Format: `{SERVICE}-{YYYYMMDD}-{SEQUENCE}`

Examples: `STAT-20250622-0042`, `CANT-20250622-0015`, `PRINT-20250622-0003`

---

## 11. Future Architecture Considerations (Phase 2+)

| Area | Phase 2 Direction |
|------|-------------------|
| **Payments** | Razorpay/Stripe webhook module; `payments` table |
| **Notifications** | Event bus + email/SMS worker (Bull + Redis) |
| **File storage** | S3-compatible object storage |
| **Caching** | Redis for sessions, menu cache, rate limits |
| **Real-time** | WebSocket or SSE for order status updates |
| **Multi-campus** | Tenant ID on all tables; subdomain routing |

---

## 12. Architecture Decision Records (Summary)

| Decision | Choice | Alternatives Considered | Rationale |
|----------|--------|-------------------------|-----------|
| API style | REST | GraphQL | Simpler for CRUD-heavy Phase 1 |
| Auth | JWT stateless | Session cookies | SPA-friendly; horizontal scaling |
| ORM vs raw SQL | TBD (Prisma or pg) | TypeORM, Knex | Prisma for DX; pg for control |
| Monorepo | Single repo | Separate repos | Easier coordination for small team |
| Unified cart | Single cart table | Per-service carts | Better UX; one checkout flow |
| QR approach | Server token in QR | Order ID only | Prevents spoofing and replay |
