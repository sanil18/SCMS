# SCMS Backend — Express REST API

Node.js / Express backend for the **Secure Cooperative Management System**.
Implements the backend requirements called out in the capstone document:

- Node.js + Express (REST architecture)
- **JWT** authentication with Bearer tokens
- **bcrypt** password hashing (salted)
- **Multi-factor authentication** (password → OTP → JWT)
- **Role-Based Access Control** (`admin`, `accountant`, `member`)
- **Helmet** hardened HTTP headers
- **Rate limiting** (global + stricter on `/api/auth/*`)
- **Immutable audit logging** for every sensitive action
- **Rule-based anomaly detection** engine for transactions

> Data is kept in-memory for the demo. The code is structured so the store
> can be swapped for PostgreSQL + Prisma/Knex without touching the route
> layer.

## Run

```bash
cd server
npm install
npm start           # → http://localhost:4000
```

## Demo credentials

| Role       | Email                         | Password   | OTP    |
|------------|-------------------------------|------------|--------|
| Admin      | `admin@scms.coop`             | `admin123` | 123456 |
| Accountant | `accountant@scms.coop`        | `acc123`   | 123456 |
| Member     | `member@scms.coop`            | `mem123`   | 123456 |

## Endpoints

| Method | Path                           | Auth             | Description                        |
|--------|--------------------------------|------------------|------------------------------------|
| GET    | `/api/health`                  | public           | Health probe                       |
| POST   | `/api/auth/login`              | public           | Step 1: username + password        |
| POST   | `/api/auth/verify-otp`         | public           | Step 2: OTP → JWT                  |
| GET    | `/api/members`                 | any              | List members (scoped by role)      |
| POST   | `/api/members`                 | admin            | Create member                      |
| PATCH  | `/api/members/:id`             | admin            | Update member                      |
| GET    | `/api/savings`                 | any              | Savings overview                   |
| POST   | `/api/savings/:id/transaction` | admin/accountant | Post deposit or withdrawal        |
| GET    | `/api/loans`                   | any              | List loans (scoped by role)        |
| POST   | `/api/loans`                   | any              | Apply for a loan                   |
| POST   | `/api/loans/:id/approve`       | admin/accountant | Approve a loan                     |
| GET    | `/api/transactions`            | any              | List transactions with anomaly flags |
| GET    | `/api/anomalies`               | admin/accountant | Flagged transactions + rules       |
| GET    | `/api/audit`                   | admin            | Immutable audit log                |

## Quick test with curl

```bash
# 1. login
curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 2. verify OTP → receive JWT
curl -s -X POST http://localhost:4000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"ticket":"U-001","otp":"123456"}'

# 3. call a protected endpoint
curl -s http://localhost:4000/api/members \
  -H "Authorization: Bearer <TOKEN_FROM_STEP_2>"
```

## Layout

```
server/
├── server.js                  # app bootstrap, security middleware
├── data/seed.js               # in-memory demo data
├── middleware/
│   ├── auth.js                # JWT sign/verify + RBAC guard
│   └── audit.js               # append-only audit logger
├── services/
│   └── anomaly.js             # rule-based fraud detection engine
└── routes/
    ├── auth.js                # login + MFA
    ├── members.js
    ├── savings.js
    ├── loans.js
    ├── transactions.js
    ├── anomalies.js
    └── audit.js
```
