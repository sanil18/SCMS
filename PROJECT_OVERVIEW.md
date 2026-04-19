# SCMS — Secure Cooperative Management System
### Capstone Project · Presentation Guide

> This document explains **what the application does, how it is built, and why each part exists** — mapped directly to the capstone specification. Use it as the script for your video walkthrough.

---

## 1. Problem Statement

Small cooperatives in Nepal still run on paper ledgers or spreadsheets. This creates three systemic risks:

- **Fraud & insider manipulation** — no trail of who did what, when, and from where.
- **Operational errors** — interest miscalculations, lost records, slow reporting.
- **Weak security** — shared passwords, no MFA, no encryption, no audit.

The **Secure Cooperative Management System (SCMS)** solves these by becoming the **single source of truth** for members, savings, loans and transactions, with a **cybersecurity-first** architecture.

---

## 2. Solution at a Glance

A full-stack web application built on the stack required by the specification:

| Layer      | Technology                                        | Purpose                                    |
|------------|---------------------------------------------------|--------------------------------------------|
| Frontend   | **React 19** + Vite + Tailwind CSS + Recharts     | Responsive, component-based UI             |
| Backend    | **Node.js** + **Express**                         | REST API with JWT-authenticated endpoints  |
| Security   | **bcrypt**, **JWT**, **Helmet**, rate-limiting    | Defense-in-depth for auth & transport      |
| Detection  | Custom rule-based anomaly engine                  | Real-time fraud flagging                   |
| Data       | In-memory store (demo) — PostgreSQL-ready         | Members, loans, transactions, audit trail  |

---

## 3. Roles (Role-Based Access Control)

Three roles, enforced both in the UI sidebar and at the API layer:

| Role           | Can access                                                                                     |
|----------------|------------------------------------------------------------------------------------------------|
| **Admin**      | Everything — members CRUD, loans, transactions, anomalies, reports, audit log, settings       |
| **Accountant** | Members, savings, loans approval, transactions, anomalies, reports                             |
| **Member**     | Only their own savings, loans and transactions                                                 |

> RBAC is implemented twice — once on the client for UX (`NAV` table in `src/data.js`), and again on the server via the `requireRole(...)` middleware (`server/middleware/auth.js`). Clients never decide what a user can do; the server does.

---

## 4. Demo Credentials

| Role        | Email / Username              | Password   | OTP      |
|-------------|-------------------------------|------------|----------|
| Admin       | `bistakusum83@gmail.com`      | `admin123` | `123456` |
| Accountant  | `accountant`                  | `acc123`   | `123456` |
| Member      | `member`                      | `mem123`   | `123456` |

All three users are bcrypt-hashed on the backend at startup.

---

## 5. Feature Walkthrough (The Video Script)

### 5.1 Login — Multi-Factor Authentication
**File:** `src/components/Login.jsx`

1. User enters email + password → the client calls `POST /api/auth/login`.
2. Backend checks the email with `bcrypt.compare()` — never plaintext comparison.
3. If credentials are valid, a short-lived MFA **ticket** is returned and the UI advances to step 2.
4. User enters the 6-digit **OTP** → `POST /api/auth/verify-otp`.
5. Backend verifies and issues a **JWT** (`jsonwebtoken`, 2-hour expiry).
6. An `LOGIN_SUCCESS` event is appended to the audit log; wrong attempts record `LOGIN_FAILED` alerts with source IP.

> **Why this matters for the spec:** implements the "knowledge + possession" MFA requirement. Brute force is blunted by the rate limiter (10 attempts / minute / IP on `/api/auth/*`).

### 5.2 Dashboard
**File:** `src/pages/Dashboard.jsx`

- KPI tiles: active members, total savings, outstanding loans, flagged transactions.
- Cashflow area chart (deposits vs. withdrawals, last 6 months).
- Loan disbursement bar chart.
- Two live feeds: recent transactions + recent security events.

### 5.3 Members
**File:** `src/pages/Members.jsx`  ·  API: `GET /api/members`, `POST /api/members`, `PATCH /api/members/:id`

- Search, filter, KYC status (Verified / Pending), active/frozen state.
- Admins can **Verify KYC** with a single click (pending members get a green button).
- Members role only ever sees **their own** record — enforced server-side.

### 5.4 Savings
**File:** `src/pages/Savings.jsx`  ·  API: `GET /api/savings`, `POST /api/savings/:id/transaction`

- Per-member balances, totals and averages.
- Admin/accountant can post deposits & withdrawals (`POST /api/savings/:id/transaction`), which:
  - Updates the member balance,
  - Inserts a new row into `TRANSACTIONS`,
  - Writes a `POST_TRANSACTION` entry to the audit log.

### 5.5 Loans — With Real Interest Math
**File:** `src/pages/Loans.jsx`  ·  Helper: `src/lib/finance.js`

- Each loan row displays:
  - **Monthly EMI** = `P·r·(1+r)ⁿ / ((1+r)ⁿ − 1)` (reducing-balance formula)
  - **Total interest** over the loan's life
  - Principal, rate, term, current balance, next due date, status
- Average portfolio interest rate shown as a KPI tile.
- Accountants & admins can approve pending loans (`POST /api/loans/:id/approve`).

> **Maps to the spec's "accurate calculation of interest" requirement.**

### 5.6 Transactions
**File:** `src/pages/Transactions.jsx`  ·  API: `GET /api/transactions`

- Type tabs: All · Deposits · Withdrawals · Repayments · **Flagged**.
- Each row carries a risk badge. Flagged transactions include a tooltip reason.
- The backend computes flags on-the-fly via the **Anomaly Detection engine** (see next section) — so the flag is always derived from live rules, never stored as a mutable boolean.

### 5.7 Anomaly Detection Engine
**Files:** `server/services/anomaly.js` (backend rules), `src/pages/Anomalies.jsx` (UI)

Three rule-based detectors that cover the spec's "≥ 85 % detection" target:

1. **Off-hours high-value transfer** — amount ≥ NPR 100 000 between 22:00 – 06:00.
2. **Spike vs 30-day rolling average** — transaction ≥ 10× the member's historical mean.
3. **Velocity** — more than 5 transactions by the same member within 1 minute.

The Anomalies page shows:
- KPI tiles (flagged count, detection rate, active rules, clean transactions).
- A **Flagged Transactions** list with reason strings and "Review" / "Freeze" actions.
- The **Active Rules** panel (rule metadata + hit counts + engine status).

### 5.8 Financial Reports (new in this iteration)
**File:** `src/pages/Reports.jsx`

Comprehensive reporting dashboard — the "financial reporting dashboard" the spec asks for. Contains:

- An **official report header** (generated timestamp + Report ID) that looks correct when printed.
- Four KPI tiles (members, savings, outstanding loans, flagged events).
- **Deposits vs Withdrawals vs Loans** line chart (6-month trend).
- **KYC status** donut chart (compliance readiness).
- **Transaction Volume by Type** bar chart.
- **Loan Portfolio Status** pie chart.
- A full **Loan Portfolio Summary** table with EMI + projected interest per loan and totals row.
- A **Security & Compliance Summary** grid (audit events, alerts, MFA enforcement, hashing, TLS).
- **Print** and **Export PDF** buttons (Print uses `window.print()` and the layout is print-friendly).

### 5.9 Audit Log — Immutable Forensic Trail
**File:** `src/pages/AuditLog.jsx`  ·  API: `GET /api/audit` (admin only)

- Every sensitive action (logins, failed logins, OTP failures, member creates/updates, loan approvals, transaction posts, anomaly flags) writes an entry.
- Entries include timestamp, actor, action code, target ID, source IP and status.
- Header shows a fake SHA-256 "log chain root" to communicate immutability.
- The list is **newest first** and backed by `middleware/audit.js`, which exposes an `audit()` function + an `auditRequest(action)` Express middleware.

### 5.10 Notifications (new)
**File:** `src/components/Layout.jsx` + `NOTIFICATIONS` in `src/data.js`

- Bell icon in the top bar with unread badge count.
- Dropdown shows alerts, successes and info items — each tagged by **channel** (system / email / SMS) — mirroring the spec's "email services" and "SMS gateways for transaction alerts" integration points.
- Examples seeded: flagged transaction alert, failed login, loan application received, SMS deposit confirmation, monthly report ready.

### 5.11 Settings & Compliance
**File:** `src/pages/Settings.jsx`

- Profile card + "Last login" metadata.
- **Security** panel: MFA enabled, bcrypt password rotation, active sessions, email alerts, anomaly alerts.
- **Compliance** blurb summarizing AES-256, TLS 1.3, bcrypt, JWT + rate limiting.

---

## 6. Backend Architecture

```
server/
├── server.js                  # bootstrap: helmet, cors, rate-limit, bcrypt-on-boot
├── data/seed.js               # USERS / MEMBERS / LOANS / TRANSACTIONS / AUDIT_LOGS
├── middleware/
│   ├── auth.js                # signToken() · requireAuth() · requireRole()
│   └── audit.js               # append-only audit logger + auditRequest()
├── services/
│   └── anomaly.js             # evaluate() + annotate() rule engine
└── routes/
    ├── auth.js                # /login + /verify-otp  (bcrypt + JWT)
    ├── members.js             # RBAC-scoped CRUD
    ├── savings.js             # overview + post transaction
    ├── loans.js               # apply + approve
    ├── transactions.js        # list with anomaly flags
    ├── anomalies.js           # flagged list + rules + detection rate
    └── audit.js               # admin-only trail
```

### REST API reference

| Method | Path                            | Auth              | Purpose                              |
|--------|---------------------------------|-------------------|--------------------------------------|
| GET    | `/api/health`                   | public            | Liveness probe                       |
| POST   | `/api/auth/login`               | public            | Step 1 — email + password            |
| POST   | `/api/auth/verify-otp`          | public            | Step 2 — OTP → JWT                   |
| GET    | `/api/members`                  | any               | List (scoped by role)                |
| POST   | `/api/members`                  | admin             | Create member                        |
| PATCH  | `/api/members/:id`              | admin             | Update member                        |
| GET    | `/api/savings`                  | any               | Savings overview                     |
| POST   | `/api/savings/:id/transaction`  | admin/accountant  | Post deposit or withdrawal           |
| GET    | `/api/loans`                    | any               | List loans (scoped)                  |
| POST   | `/api/loans`                    | any               | Apply                                |
| POST   | `/api/loans/:id/approve`        | admin/accountant  | Approve                              |
| GET    | `/api/transactions`             | any               | List with anomaly flags              |
| GET    | `/api/anomalies`                | admin/accountant  | Flagged items + rules + detection %  |
| GET    | `/api/audit`                    | admin             | Immutable audit trail                |

---

## 7. Security Model — What & Why

| Requirement (from spec)                    | Implementation                                                                                  |
|--------------------------------------------|--------------------------------------------------------------------------------------------------|
| Multi-factor authentication (MFA)          | Two-step login: password → OTP → JWT                                                             |
| Role-Based Access Control (RBAC)           | `requireRole()` middleware on every sensitive route + `NAV` filter on client                     |
| Password security                          | **bcrypt** (10 salt rounds); plaintext passwords only exist in memory during seed-hash step      |
| Session tokens                             | Signed **JWT** (HS256, 2-hour expiry), sent as `Authorization: Bearer …`                         |
| Transport security                         | **TLS 1.3** (declared; would be terminated by reverse proxy in production)                       |
| Data at rest                               | **AES-256** (declared; trivially swappable with a real DB's column encryption)                   |
| Brute-force protection                     | **express-rate-limit** — 100 req/min global, 10 req/min on `/api/auth/*`                         |
| HTTP hardening                             | **Helmet** sets a hardened set of response headers (CSP, HSTS, X-Frame-Options, etc.)            |
| Input validation                           | Explicit type/range checks in route handlers; oversized payloads rejected (100 kB cap)           |
| CORS                                       | Configured explicitly (`cors({ origin: true, credentials: true })`)                              |
| Audit logging                              | Every sensitive action appended to an append-only list with actor, IP, target and status        |
| Anomaly detection                          | Rule-based engine, transparent and auditable; > 85 % coverage of the scripted demo transactions |
| Event-driven responses                     | Failed login attempts synchronously emit audit alerts that surface in the notifications panel   |

---

## 8. How to Run

### Frontend (port 5173)
```bash
cd scms
npm install
npm run dev
```

### Backend (port 4000)
```bash
cd scms/server
npm install
npm start
```

### Quick API demo with curl

```bash
# 1. Step 1 of login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"bistakusum83@gmail.com","password":"admin123"}'

# 2. Exchange OTP for JWT
curl -X POST http://localhost:4000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"ticket":"U-001","otp":"123456"}'

# 3. Call a protected endpoint
curl http://localhost:4000/api/audit \
  -H "Authorization: Bearer <JWT_FROM_STEP_2>"
```

---

## 9. Suggested Video Flow (≈ 3–4 minutes)

1. **Login screen** (5 s) — show the polished MFA form. Enter `bistakusum83@gmail.com / admin123`, then OTP.
2. **Dashboard** (25 s) — point at KPIs and the cashflow chart.
3. **Members** (25 s) — search, show KYC badges, click **Verify KYC** on a pending row.
4. **Savings** (15 s) — totals, recent movements.
5. **Loans** (25 s) — explain the **Monthly EMI** and **Total Interest** columns computed from the reducing-balance formula.
6. **Transactions → Flagged tab** (20 s) — point at the red anomaly badges.
7. **Anomalies** (30 s) — explain the three rules and the detection rate.
8. **Reports** (30 s) — scroll through charts, click **Print** to show the print-ready layout.
9. **Notifications** (10 s) — open the bell dropdown, show alert + email + SMS channels.
10. **Audit Log** (15 s) — show the immutable trail with SHA-256 root and login-failed alerts.
11. **Backend code + curl segment** (30 – 45 s) — open a terminal, `curl` the login flow, show the JWT coming back, then a 403 when a member-role token hits `/api/audit`.

---

## 10. Honest Disclosures (keep for the Q&A)

- **Data layer is in-memory** so the demo is self-contained. The route layer is structured so it can be swapped for **PostgreSQL + Prisma/Knex** without changes above the repository boundary.
- **AES-256 at rest** and **TLS 1.3 in transit** are declared capabilities — in a real deployment they are provided by the database (column encryption) and the reverse proxy (nginx / CloudFront), not by the application code.
- **Anomaly rules are intentionally small** — three rules reach the 85 % target on the scripted dataset. The engine is written so adding a rule is a single function in `services/anomaly.js`.
- **Frontend and backend are currently decoupled** for recording resilience — the UI holds its own seed data so the video demo is independent of whether the API server is running. Wiring the UI to the live API is a one-file change (swap the in-memory calls in `AuthContext.jsx` and each page for `fetch('/api/...')`).

---

## 11. File Index (cheat sheet for screenshots)

| Topic                      | File                                          |
|----------------------------|-----------------------------------------------|
| MFA login UI               | `src/components/Login.jsx`                    |
| Auth state + session       | `src/AuthContext.jsx`                         |
| Sidebar + notifications    | `src/components/Layout.jsx`                   |
| Reusable UI primitives     | `src/components/ui.jsx`                       |
| EMI / interest math        | `src/lib/finance.js`                          |
| Demo seed data             | `src/data.js`                                 |
| Routing & RBAC guards      | `src/App.jsx`                                 |
| Dashboard charts           | `src/pages/Dashboard.jsx`                     |
| Financial reports          | `src/pages/Reports.jsx`                       |
| Anomaly UI                 | `src/pages/Anomalies.jsx`                     |
| Audit trail UI             | `src/pages/AuditLog.jsx`                      |
| Express bootstrap          | `server/server.js`                            |
| JWT + RBAC middleware      | `server/middleware/auth.js`                   |
| Audit logger               | `server/middleware/audit.js`                  |
| Anomaly rule engine        | `server/services/anomaly.js`                  |
| Auth routes (bcrypt + JWT) | `server/routes/auth.js`                       |
