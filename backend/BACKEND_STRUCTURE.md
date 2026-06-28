# CampusOS Backend — Project Structure

Node.js + Express + PostgreSQL + JWT

This document describes the planned backend folder layout. **No application code has been generated yet.** Folders are scaffolded with `.gitkeep` placeholders.

```
backend/
├── migrations/
├── scripts/
├── uploads/
├── tests/
└── src/
    ├── config/
    ├── constants/
    ├── db/
    ├── middleware/
    ├── modules/
    ├── routes/
    ├── utils/
    └── validators/
```

---

## Root (`backend/`)

| Item | Purpose |
|------|---------|
| **Purpose** | Top-level backend package; holds migrations, runtime config, scripts, and source code |
| **Files (planned)** | `package.json`, `.env.example`, `.gitignore`, `BACKEND_STRUCTURE.md` |
| **Responsibility** | Package definition, environment template, dependency management, and entry-point wiring |

---

## `migrations/`

| Item | Detail |
|------|--------|
| **Purpose** | Version-controlled PostgreSQL schema changes |
| **Files** | `001_initial_schema.sql`, `002_schema_improvements.sql`, future numbered migrations |
| **Responsibility** | Define tables, indexes, constraints, enums, and triggers. Applied sequentially; never edited after deployment |

---

## `scripts/`

| Item | Detail |
|------|--------|
| **Purpose** | Operational CLI scripts run outside the HTTP server |
| **Files (planned)** | `migrate.js` — runs pending SQL migrations against `DATABASE_URL` |
| **Responsibility** | Database migration runner, seed scripts (future), one-off maintenance tasks |

---

## `uploads/`

| Item | Detail |
|------|--------|
| **Purpose** | Local filesystem storage for user-uploaded printout files (Phase 1) |
| **Files (planned)** | `printouts/` subdirectory; uploaded files stored by UUID filename |
| **Responsibility** | Persist print job uploads outside the web root; paths referenced in `print_jobs.file_path` |

---

## `tests/`

| Item | Detail |
|------|--------|
| **Purpose** | Automated test suites for the API |
| **Files (planned)** | |
| | `unit/` — isolated tests for services, utils, validators |
| | `integration/` — HTTP endpoint tests against a test database |
| | `helpers/` — test fixtures, auth helpers, DB setup/teardown |
| **Responsibility** | Verify business logic, auth guards, and API contracts |

---

## `src/`

| Item | Detail |
|------|--------|
| **Purpose** | All application source code |
| **Files (planned)** | `index.js` (server bootstrap), `app.js` (Express app factory) |
| **Responsibility** | Wire middleware, mount routes, start HTTP listener |

---

## `src/config/`

| Item | Detail |
|------|--------|
| **Purpose** | Centralized configuration loaded from environment variables |
| **Files (planned)** | |
| | `env.js` — validate and export env vars (PORT, DATABASE_URL, JWT secrets, CORS, UPLOAD_DIR) |
| | `database.js` — database connection settings derived from env |
| **Responsibility** | Single source of truth for runtime config; fail fast on missing required vars |

---

## `src/constants/`

| Item | Detail |
|------|--------|
| **Purpose** | Application-wide constants and enums mirroring the database |
| **Files (planned)** | |
| | `roles.js` — `student`, `staff`, `admin` |
| | `serviceTypes.js` — `stationery`, `canteen`, `printout` |
| | `orderStatus.js` — order lifecycle states |
| | `httpStatus.js` — standard HTTP status codes (optional) |
| **Responsibility** | Avoid magic strings; keep domain values consistent across modules |

---

## `src/db/`

| Item | Detail |
|------|--------|
| **Purpose** | Database connection and query utilities |
| **Files (planned)** | |
| | `pool.js` — PostgreSQL connection pool (`pg`) |
| | `query.js` — thin wrapper for parameterized queries and transactions |
| **Responsibility** | Manage DB connections, provide transaction helper for checkout/stock operations |

---

## `src/middleware/`

| Item | Detail |
|------|--------|
| **Purpose** | Express middleware applied globally or per-route |
| **Files (planned)** | |
| | `auth.js` — verify JWT access token; attach `req.user` |
| | `roleGuard.js` — enforce role-based access (`student`, `staff`, `admin`) |
| | `errorHandler.js` — catch errors; return consistent JSON error responses |
| | `validate.js` — request body/query validation wrapper |
| | `notFound.js` — 404 handler for unknown routes |
| | `rateLimiter.js` — rate limiting on auth and upload endpoints |
| **Responsibility** | Cross-cutting HTTP concerns: auth, authorization, validation, errors, security |

---

## `src/routes/`

| Item | Detail |
|------|--------|
| **Purpose** | Top-level route aggregator mounting all module routers under `/api/v1` |
| **Files (planned)** | `index.js` — imports and mounts module route files |
| **Responsibility** | Single registry of all API routes; keeps `app.js` clean |

---

## `src/utils/`

| Item | Detail |
|------|--------|
| **Purpose** | Shared, stateless helper functions |
| **Files (planned)** | |
| | `jwt.js` — sign/verify access and refresh tokens |
| | `password.js` — bcrypt hash and compare |
| | `qr.js` — generate pickup tokens |
| | `orderNumber.js` — format `{SERVICE}-{YYYYMMDD}-{SEQUENCE}` |
| | `pagination.js` — offset/limit helpers for list endpoints |
| | `AppError.js` — custom error class with `code` and `status` |
| | `asyncHandler.js` — wrap async route handlers for error propagation |
| **Responsibility** | Reusable logic with no domain-specific business rules |

---

## `src/validators/`

| Item | Detail |
|------|--------|
| **Purpose** | Request validation schemas (e.g. Zod or express-validator rules) |
| **Files (planned)** | |
| | `auth.validator.js` |
| | `cart.validator.js` |
| | `order.validator.js` |
| | `stationery.validator.js` |
| | `canteen.validator.js` |
| | `printout.validator.js` |
| | `admin.validator.js` |
| **Responsibility** | Define input shapes and constraints before controllers run |

---

## `src/modules/`

| Item | Detail |
|------|--------|
| **Purpose** | Domain-driven feature modules; each owns one business area |
| **Pattern** | `*.routes.js` → `*.controller.js` → `*.service.js` → `*.repository.js` |
| **Responsibility** | Encapsulate routes, HTTP handling, business logic, and SQL per domain |

Each module subfolder follows the same four-file pattern:

| File | Layer | Responsibility |
|------|-------|----------------|
| `*.routes.js` | Router | Define HTTP methods and paths; apply middleware and validators |
| `*.controller.js` | Controller | Parse request, call service, format JSON response |
| `*.service.js` | Service | Business rules, orchestration, transactions |
| `*.repository.js` | Repository | Parameterized SQL queries; no business logic |

---

### `src/modules/auth/`

| Item | Detail |
|------|--------|
| **Purpose** | User registration, login, token refresh, logout |
| **Files (planned)** | `auth.routes.js`, `auth.controller.js`, `auth.service.js`, `auth.repository.js` |
| **Responsibility** | JWT issuance, refresh token rotation, password hashing, `GET /auth/me` |

---

### `src/modules/cart/`

| Item | Detail |
|------|--------|
| **Purpose** | Unified shopping cart across all three services |
| **Files (planned)** | `cart.routes.js`, `cart.controller.js`, `cart.service.js`, `cart.repository.js` |
| **Responsibility** | Add/update/remove cart items; validate availability; compute totals |

---

### `src/modules/orders/`

| Item | Detail |
|------|--------|
| **Purpose** | Order lifecycle from checkout through pickup |
| **Files (planned)** | `orders.routes.js`, `orders.controller.js`, `orders.service.js`, `orders.repository.js` |
| **Responsibility** | Checkout (split cart by service), status transitions, cancellation, order history, staff queues |

---

### `src/modules/qr/`

| Item | Detail |
|------|--------|
| **Purpose** | QR pickup token generation and staff verification |
| **Files (planned)** | `qr.routes.js`, `qr.controller.js`, `qr.service.js`, `qr.repository.js` |
| **Responsibility** | Create `qr_pickups` records, serve QR payload to students, verify scans, mark `is_used` |

---

### `src/modules/stationery/`

| Item | Detail |
|------|--------|
| **Purpose** | Stationery catalog and stock management |
| **Files (planned)** | `stationery.routes.js`, `stationery.controller.js`, `stationery.service.js`, `stationery.repository.js` |
| **Responsibility** | Product/category CRUD, stock queries, soft delete, `inventory_transactions` logging on stock changes |

---

### `src/modules/canteen/`

| Item | Detail |
|------|--------|
| **Purpose** | Canteen menu and time-slot ordering |
| **Files (planned)** | `canteen.routes.js`, `canteen.controller.js`, `canteen.service.js`, `canteen.repository.js` |
| **Responsibility** | Menu CRUD, meal period availability, order cutoff rules, soft delete |

---

### `src/modules/printout/`

| Item | Detail |
|------|--------|
| **Purpose** | Document upload, pricing, and print queue |
| **Files (planned)** | `printout.routes.js`, `printout.controller.js`, `printout.service.js`, `printout.repository.js` |
| **Responsibility** | File upload (multer), page count extraction, price estimation, print job queue for staff |

---

### `src/modules/admin/`

| Item | Detail |
|------|--------|
| **Purpose** | Cross-service admin operations and reporting |
| **Files (planned)** | `admin.routes.js`, `admin.controller.js`, `admin.service.js`, `admin.repository.js` |
| **Responsibility** | Dashboard stats, user management, order search/filter, daily reports, status overrides |

---

## Request Flow

```
HTTP Request
    → middleware (auth, validate, rateLimit)
    → routes/index.js
    → module/*.routes.js
    → module/*.controller.js
    → module/*.service.js
    → module/*.repository.js
    → PostgreSQL
    ← JSON response
    ← errorHandler (on failure)
```

---

## Status

- [x] Migrations: `001_initial_schema.sql`, `002_schema_improvements.sql`
- [x] Folder structure scaffolded
- [ ] Application code — **awaiting approval**
