# CampusOS — Project Plan

## Overview

**CampusOS** is a Smart Campus Platform that unifies everyday campus services into a single digital experience. Phase 1 focuses on three high-frequency student services—stationery ordering, canteen ordering, and printout services—built on a shared foundation of authentication, cart, orders, QR pickup, and an admin dashboard.

### Vision

Replace fragmented, manual campus workflows (paper forms, cash counters, long queues) with a unified, mobile-friendly platform that students and staff can use from any device.

### Goals (Phase 1)

| Goal | Success Metric |
|------|----------------|
| Reduce queue time at canteen and stationery counters | Average pickup wait < 5 minutes |
| Digitize printout requests | 80% of print jobs submitted digitally |
| Centralize order tracking | 100% of orders have real-time status |
| Enable contactless pickup | QR-based pickup for all order types |

---

## Scope

### In Scope (Phase 1)

| Module | Description |
|--------|-------------|
| **Authentication** | Student/staff login, JWT sessions, role-based access |
| **Stationery Ordering** | Browse catalog, add to cart, place order, QR pickup |
| **Canteen Ordering** | Menu browsing, time-slot selection, order placement, QR pickup |
| **Printout Service** | Upload documents, configure print options, pay, collect via QR |
| **Cart** | Unified cart supporting multi-service items |
| **Orders** | Order history, status tracking, cancellation rules |
| **QR Pickup** | Generate and scan QR codes for order verification |
| **Admin Dashboard** | Manage catalogs, menus, orders, users, and reports |

### Out of Scope (Phase 1)

- Payment gateway integration (cash/UPI at counter assumed; digital payments deferred)
- Mobile native apps (responsive web only)
- Library, hostel, transport, or other campus modules
- Push notifications / SMS alerts
- Multi-campus / multi-tenant support
- Inventory auto-replenishment and supplier management

---

## Phased Roadmap

```
Phase 1 (Current)          Phase 2 (Future)           Phase 3 (Future)
─────────────────          ─────────────────          ──────────────────
Stationery Ordering        Payment Integration        Library Management
Canteen Ordering           Notifications              Hostel Services
Printout Service           Analytics & Reports        Transport Booking
Auth, Cart, Orders         Inventory Management       Multi-campus Support
QR Pickup
Admin Dashboard
```

---

## Phase 1 Milestones

### Milestone 1 — Foundation (Weeks 1–2)

**Deliverables:**
- Project scaffolding (monorepo or separate frontend/backend repos)
- PostgreSQL schema design and initial migrations
- Express API skeleton with health check and error handling
- React + Vite + Tailwind frontend shell with routing
- JWT authentication (register, login, logout, protected routes)
- Role model: `student`, `staff`, `admin`

**Exit criteria:** A user can register, log in, and access role-appropriate pages.

---

### Milestone 2 — Shared Services (Weeks 3–4)

**Deliverables:**
- Unified cart API and UI (add, update quantity, remove, clear)
- Order lifecycle engine (status transitions, timestamps)
- Order history and detail views for students
- QR code generation on order confirmation
- QR scan endpoint for staff to verify and mark pickup

**Exit criteria:** Cart and order flows work end-to-end with placeholder catalog items.

---

### Milestone 3 — Stationery Module (Weeks 5–6)

**Deliverables:**
- Stationery product catalog (CRUD via admin)
- Category and stock display (manual stock updates by admin)
- Student browse → cart → checkout → order → QR pickup flow
- Admin: manage products, view stationery orders, mark fulfilled

**Exit criteria:** Full stationery ordering cycle demonstrated with test data.

---

### Milestone 4 — Canteen Module (Weeks 7–8)

**Deliverables:**
- Menu management (items, categories, availability, daily specials)
- Time-slot or meal-period selection (breakfast / lunch / snacks)
- Order cutoff rules (e.g., order 30 min before slot)
- Kitchen/admin view: incoming orders, status updates (preparing → ready)
- QR pickup at canteen counter

**Exit criteria:** Student can order lunch for a time slot; canteen staff can fulfill via dashboard.

---

### Milestone 5 — Printout Module (Weeks 9–10)

**Deliverables:**
- File upload (PDF, DOCX, images) with size and type validation
- Print configuration: copies, color/B&W, single/double-sided, page range
- Price calculation based on page count and options
- Print queue for admin/staff
- QR pickup when print job is ready

**Exit criteria:** Student uploads a document, configures options, places order, and collects via QR.

---

### Milestone 6 — Admin Dashboard & Polish (Weeks 11–12)

**Deliverables:**
- Unified admin dashboard: orders across all services, filters, search
- User management (view, deactivate, role assignment)
- Basic reports: daily order volume, revenue summary (manual pricing)
- Responsive UI polish, loading states, error handling
- End-to-end testing and deployment documentation

**Exit criteria:** Admin can manage all three services from one dashboard; platform ready for pilot deployment.

---

## Team & Responsibilities

| Role | Responsibilities |
|------|------------------|
| **Backend Developer** | Express API, PostgreSQL schema, JWT auth, business logic |
| **Frontend Developer** | React UI, Tailwind styling, API integration, QR display |
| **Full-stack / Lead** | Architecture decisions, code review, deployment |
| **Admin / Campus Staff** | UAT, catalog data, workflow validation |

*For a solo or small team, one developer may cover multiple roles sequentially by milestone.*

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend | React + Vite + Tailwind | Fast dev experience, component ecosystem, utility-first CSS |
| Backend | Node.js + Express | JavaScript full-stack, large middleware ecosystem |
| Database | PostgreSQL | Relational data (orders, users, catalogs), ACID compliance |
| Auth | JWT (access + refresh tokens) | Stateless API, standard for SPAs |
| File storage | Local filesystem (Phase 1) | Simplicity; S3/cloud storage in Phase 2 |
| QR codes | Server-generated, stored per order | Offline-friendly display on student device |
| API style | REST JSON | Straightforward for Phase 1 scope |

---

## Repository Structure (Planned)

```
CampusOS/
├── PROJECT_PLAN.md
├── REQUIREMENTS.md
├── SYSTEM_ARCHITECTURE.md
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/        # auth, cart, orders, stationery, canteen, printout, admin
│   │   ├── routes/
│   │   └── utils/
│   ├── migrations/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/       # API client
│   │   └── context/
│   └── package.json
└── docker-compose.yml      # PostgreSQL for local dev
```

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep across three modules | Delayed delivery | Strict milestone boundaries; shared cart/orders first |
| File upload security (printout) | High | Validate MIME types, size limits, virus scan in Phase 2 |
| Concurrent order / stock conflicts | Medium | Optimistic locking or stock reservation on checkout |
| QR code sharing / fraud | Medium | Single-use QR tokens, short expiry, staff verification |
| Poor mobile UX on campus Wi-Fi | Medium | Lightweight pages, optimistic UI, offline QR display |

---

## Definition of Done (Phase 1)

- [ ] All functional requirements in `REQUIREMENTS.md` implemented
- [ ] API documented (OpenAPI or README per module)
- [ ] Admin can operate all three services without database access
- [ ] Student flows work on mobile viewport (375px+)
- [ ] JWT auth with role guards on all protected endpoints
- [ ] PostgreSQL migrations version-controlled
- [ ] Environment variables documented (`.env.example`)
- [ ] Pilot deployment on campus staging environment

---

## Next Steps

1. Review and approve `REQUIREMENTS.md` and `SYSTEM_ARCHITECTURE.md`
2. Set up repository, linting, and CI skeleton
3. Begin Milestone 1 — Foundation
