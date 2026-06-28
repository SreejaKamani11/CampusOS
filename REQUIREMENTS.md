# CampusOS — Requirements Specification

## Document Info

| Field | Value |
|-------|-------|
| **Product** | CampusOS — Smart Campus Platform |
| **Version** | 1.0 (Phase 1) |
| **Status** | Draft |

---

## 1. Introduction

### 1.1 Purpose

This document defines functional and non-functional requirements for Phase 1 of CampusOS: a unified platform for stationery ordering, canteen ordering, and printout services on a college campus.

### 1.2 Stakeholders

| Stakeholder | Interest |
|-------------|----------|
| **Students** | Order stationery, food, and printouts quickly; track status; pickup via QR |
| **Canteen Staff** | View and fulfill food orders; update order status |
| **Stationery Staff** | Manage stock display; fulfill stationery orders |
| **Print Center Staff** | Process print jobs; mark jobs ready |
| **Campus Admin** | Manage users, catalogs, menus; view reports |

### 1.3 User Roles

| Role | Code | Description |
|------|------|-------------|
| Student | `student` | Default role; can browse, cart, order, view own orders |
| Staff | `staff` | Service-specific fulfillment; scan QR; update order status |
| Admin | `admin` | Full platform management |

---

## 2. Functional Requirements

### 2.1 Authentication (AUTH)

| ID | Requirement | Priority |
|----|-------------|----------|
| AUTH-01 | System shall allow users to register with email, password, name, and student/staff ID | Must |
| AUTH-02 | System shall authenticate users via email and password | Must |
| AUTH-03 | System shall issue JWT access token (short-lived) and refresh token (long-lived) on login | Must |
| AUTH-04 | System shall protect API routes based on user role | Must |
| AUTH-05 | System shall allow users to log out (invalidate refresh token) | Must |
| AUTH-06 | System shall allow password reset via email (Phase 1: admin-assisted reset acceptable) | Should |
| AUTH-07 | Admin shall assign or change user roles | Must |

**Business rules:**
- Password minimum 8 characters
- Email must be unique
- New registrations default to `student` role
- Only `admin` can promote users to `staff` or `admin`

---

### 2.2 Cart (CART)

| ID | Requirement | Priority |
|----|-------------|----------|
| CART-01 | System shall maintain one active cart per authenticated user | Must |
| CART-02 | Cart shall support items from stationery, canteen, and printout services | Must |
| CART-03 | User shall add items to cart with quantity and service-specific options | Must |
| CART-04 | User shall update item quantity in cart | Must |
| CART-05 | User shall remove individual items from cart | Must |
| CART-06 | User shall clear entire cart | Must |
| CART-07 | Cart shall display subtotal per service and grand total | Must |
| CART-08 | Cart shall persist across sessions (stored server-side) | Must |
| CART-09 | Cart shall validate item availability before checkout | Must |

**Business rules:**
- Cart items are typed: `stationery`, `canteen`, `printout`
- Printout cart items include file reference and print configuration
- Canteen cart items include selected meal time slot
- Unavailable items shall be flagged; checkout blocked until resolved

---

### 2.3 Orders (ORD)

| ID | Requirement | Priority |
|----|-------------|----------|
| ORD-01 | User shall checkout cart to create one or more orders | Must |
| ORD-02 | Checkout may split cart into separate orders per service type | Must |
| ORD-03 | Each order shall have a unique order number | Must |
| ORD-04 | Order shall record: user, items, total, timestamps, status | Must |
| ORD-05 | User shall view list of their orders with status | Must |
| ORD-06 | User shall view order detail including items and pickup QR | Must |
| ORD-07 | User may cancel order only while status is `pending` | Must |
| ORD-08 | Staff shall view orders for their assigned service | Must |
| ORD-09 | Staff shall update order status through defined transitions | Must |
| ORD-10 | System shall record status change history with timestamp and actor | Should |

**Order status lifecycle:**

```
pending → confirmed → preparing → ready → picked_up
                  ↘ cancelled
```

| Status | Description |
|--------|-------------|
| `pending` | Order placed; awaiting confirmation |
| `confirmed` | Accepted by staff/system |
| `preparing` | Being prepared (canteen/printout) |
| `ready` | Ready for pickup |
| `picked_up` | QR verified; order complete |
| `cancelled` | Cancelled by user or admin |

---

### 2.4 QR Pickup (QR)

| ID | Requirement | Priority |
|----|-------------|----------|
| QR-01 | System shall generate a unique QR code when order reaches `confirmed` or `ready` | Must |
| QR-02 | QR code shall encode a single-use pickup token | Must |
| QR-03 | Student shall display QR on their device at pickup counter | Must |
| QR-04 | Staff shall scan QR via staff interface to verify order | Must |
| QR-05 | Successful scan shall transition order to `picked_up` | Must |
| QR-06 | QR token shall expire after 24 hours or upon successful scan | Must |
| QR-07 | Invalid or expired QR shall return clear error to staff | Must |

**Business rules:**
- One QR per order (not per item)
- QR scan requires `staff` or `admin` role
- Re-scan of already picked up order shall show "already collected" message

---

### 2.5 Stationery Ordering (STAT)

| ID | Requirement | Priority |
|----|-------------|----------|
| STAT-01 | Student shall browse stationery catalog by category | Must |
| STAT-02 | Catalog shall display: name, description, price, image, stock status | Must |
| STAT-03 | Student shall search and filter products | Should |
| STAT-04 | Student shall add stationery items to cart | Must |
| STAT-05 | System shall prevent adding out-of-stock items to cart | Must |
| STAT-06 | Admin shall CRUD stationery products | Must |
| STAT-07 | Admin shall manage categories | Must |
| STAT-08 | Admin shall update stock quantity | Must |
| STAT-09 | Stock shall decrement on order confirmation | Must |

**Product fields:**
- Name, description, price, category, stock quantity, image URL, active flag

---

### 2.6 Canteen Ordering (CANT)

| ID | Requirement | Priority |
|----|-------------|----------|
| CANT-01 | Student shall browse canteen menu by category and meal period | Must |
| CANT-02 | Menu item shall display: name, description, price, availability | Must |
| CANT-03 | Student shall select a pickup time slot (meal period) when adding to cart | Must |
| CANT-04 | System shall enforce order cutoff (configurable per slot, default 30 min before) | Must |
| CANT-05 | Student shall add canteen items to cart | Must |
| CANT-06 | Admin shall CRUD menu items and categories | Must |
| CANT-07 | Admin shall mark items unavailable (sold out) for the day | Must |
| CANT-08 | Canteen staff shall view orders filtered by time slot | Must |
| CANT-09 | Canteen staff shall update status: confirmed → preparing → ready | Must |

**Meal periods (default):**
- Breakfast: 07:00–09:00
- Lunch: 12:00–14:00
- Snacks: 16:00–18:00

---

### 2.7 Printout Service (PRINT)

| ID | Requirement | Priority |
|----|-------------|----------|
| PRINT-01 | Student shall upload document (PDF, DOCX, PNG, JPG) | Must |
| PRINT-02 | System shall enforce max file size (default 20 MB) | Must |
| PRINT-03 | Student shall configure: copies, color mode (B&W/color), sides (single/double), page range | Must |
| PRINT-04 | System shall calculate price based on page count and options | Must |
| PRINT-05 | Student shall add configured print job to cart | Must |
| PRINT-06 | Print staff shall view print queue ordered by submission time | Must |
| PRINT-07 | Print staff shall download uploaded file for printing | Must |
| PRINT-08 | Print staff shall update status through preparing → ready | Must |
| PRINT-09 | System shall reject unsupported file types | Must |

**Pricing model (configurable by admin):**
- B&W single-sided: base rate per page
- Color: multiplier on base rate
- Double-sided: per sheet rate

---

### 2.8 Admin Dashboard (ADMIN)

| ID | Requirement | Priority |
|----|-------------|----------|
| ADMIN-01 | Admin shall access unified dashboard after login | Must |
| ADMIN-02 | Dashboard shall show order counts by status and service (today) | Must |
| ADMIN-03 | Admin shall view, search, and filter all orders | Must |
| ADMIN-04 | Admin shall manage users (list, deactivate, change role) | Must |
| ADMIN-05 | Admin shall access stationery catalog management | Must |
| ADMIN-06 | Admin shall access canteen menu management | Must |
| ADMIN-07 | Admin shall access print queue and pricing settings | Must |
| ADMIN-08 | Admin shall view basic daily summary report (order count, revenue) | Should |
| ADMIN-09 | Admin shall manually override order status in exceptional cases | Should |

---

## 3. Non-Functional Requirements

### 3.1 Performance

| ID | Requirement |
|----|-------------|
| NFR-01 | API response time < 500 ms for 95th percentile under normal load |
| NFR-02 | Page initial load < 3 s on 3G campus network |
| NFR-03 | Support at least 200 concurrent users (Phase 1 campus size) |

### 3.2 Security

| ID | Requirement |
|----|-------------|
| NFR-04 | All API communication over HTTPS in production |
| NFR-05 | Passwords hashed with bcrypt (cost factor ≥ 10) |
| NFR-06 | JWT signed with strong secret; access token TTL ≤ 15 min |
| NFR-07 | File uploads validated by MIME type and extension |
| NFR-08 | Role-based access enforced on every protected endpoint |
| NFR-09 | SQL injection prevention via parameterized queries / ORM |

### 3.3 Reliability

| ID | Requirement |
|----|-------------|
| NFR-10 | Database backups daily in production |
| NFR-11 | Graceful error responses; no stack traces exposed to client |
| NFR-12 | Order data never hard-deleted; soft delete or archive |

### 3.4 Usability

| ID | Requirement |
|----|-------------|
| NFR-13 | Responsive design: mobile (375px), tablet, desktop |
| NFR-14 | Clear feedback for loading, success, and error states |
| NFR-15 | Accessible color contrast (WCAG AA minimum) |

### 3.5 Maintainability

| ID | Requirement |
|----|-------------|
| NFR-16 | Environment configuration via `.env` files |
| NFR-17 | Database schema versioned via migrations |
| NFR-18 | Modular backend structure per domain (auth, cart, orders, etc.) |

---

## 4. Data Requirements

### 4.1 Core Entities

| Entity | Key Attributes |
|--------|----------------|
| **User** | id, email, password_hash, name, campus_id, role, active, created_at |
| **Cart** | id, user_id, updated_at |
| **CartItem** | id, cart_id, service_type, reference_id, quantity, options (JSON), price |
| **Order** | id, order_number, user_id, service_type, status, total, pickup_token, created_at |
| **OrderItem** | id, order_id, name, quantity, unit_price, options (JSON) |
| **OrderStatusHistory** | id, order_id, status, changed_by, changed_at |
| **StationeryProduct** | id, name, description, price, category_id, stock, image_url, active |
| **StationeryCategory** | id, name, sort_order |
| **CanteenMenuItem** | id, name, description, price, category_id, available, meal_periods |
| **CanteenCategory** | id, name, sort_order |
| **PrintJob** | id, user_id, file_path, file_name, page_count, options (JSON), calculated_price |
| **RefreshToken** | id, user_id, token_hash, expires_at |

### 4.2 Data Retention

- Orders: retained indefinitely (archived after 1 year)
- Uploaded print files: deleted 7 days after pickup
- Refresh tokens: deleted on expiry or logout

---

## 5. External Interfaces

### 5.1 Student Web App

- Browser-based SPA (React)
- Interacts with REST API via JSON
- Displays QR codes using client-side rendering library

### 5.2 Staff Web App

- Same SPA with role-gated routes
- QR scanner via device camera (browser MediaDevices API)

### 5.3 API

- REST JSON over HTTP
- Authentication: `Authorization: Bearer <access_token>`
- Standard HTTP status codes

---

## 6. Constraints & Assumptions

### Constraints

- Phase 1 payment is offline (pay at counter); order total displayed for reference
- Single campus deployment; no multi-tenancy
- English UI only in Phase 1

### Assumptions

- Campus provides PostgreSQL hosting or Docker-capable server
- Students have smartphones for QR display
- Staff have desktop or tablet for dashboard and QR scanning
- Campus email domain used for registration validation (optional policy)

---

## 7. Acceptance Criteria Summary

Phase 1 is accepted when:

1. A student can register, log in, and complete an order in each of the three services
2. Each completed order generates a scannable QR code for pickup
3. Staff can scan QR and mark orders as picked up
4. Admin can manage catalogs, menus, users, and view order reports
5. All Must-priority requirements are implemented and verified
6. Application runs on staging environment accessible to pilot users

---

## 8. Glossary

| Term | Definition |
|------|------------|
| **Pickup token** | Single-use identifier embedded in QR code for order verification |
| **Meal period** | Defined time window for canteen order pickup |
| **Service type** | One of: `stationery`, `canteen`, `printout` |
| **Checkout** | Process of converting cart items into orders |
