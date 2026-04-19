# SCMS — Secure Cooperative Management System

A full-stack web application for cooperatives to manage members, savings, loans and transactions with a cybersecurity-first architecture (MFA, RBAC, JWT, bcrypt, rate limiting, audit logging, rule-based anomaly detection).

- **Frontend:** React 19 + Vite + Tailwind CSS + Recharts + Lucide (port **5173**)
- **Backend:** Node.js + Express REST API with JWT, bcrypt, Helmet, rate limiting (port **4000**)

> Full feature walkthrough and presentation script: see **[`PROJECT_OVERVIEW.md`](./PROJECT_OVERVIEW.md)**.

---

## 🚀 Running on another laptop — step by step

Follow these steps on any fresh Mac, Windows or Linux machine.

### 1. Install prerequisites

You only need **Node.js** and **Git**.

| Tool    | Minimum version | Install                                                     |
|---------|-----------------|-------------------------------------------------------------|
| Node.js | 18 or newer     | <https://nodejs.org/en/download> (LTS installer works fine) |
| npm     | comes with Node | bundled with the Node.js installer                          |
| Git     | any recent      | <https://git-scm.com/downloads>                             |

Verify the install:

```bash
node -v      # should print v18.x or higher
npm -v       # should print a version number
git --version
```

### 2. Clone the repository

```bash
git clone https://github.com/sanil18/SCMS.git
cd SCMS
```

### 3. Install & start the **backend** (Express API)

Open a terminal tab in the project root:

```bash
cd server
npm install
npm start
```

You should see:

```
🛡️  SCMS API listening on http://localhost:4000
```

Leave this terminal running.

### 4. Install & start the **frontend** (React app)

Open a **second** terminal tab in the project root:

```bash
npm install
npm run dev
```

You should see:

```
VITE v8.x  ready in … ms
➜  Local:   http://localhost:5173/
```

### 5. Open the app

Visit **<http://localhost:5173>** in your browser.

### 6. Log in with the demo credentials

| Role        | Email / Username              | Password   | OTP      |
|-------------|-------------------------------|------------|----------|
| **Admin**   | `bistakusum83@gmail.com`      | `admin123` | `123456` |
| Accountant  | `accountant`                  | `acc123`   | `123456` |
| Member      | `member`                      | `mem123`   | `123456` |

The login flow is: **email + password → OTP screen → dashboard** (MFA).

---

## 🧪 Quick API sanity check (optional)

With the backend running, try these from any terminal:

```bash
# Health probe
curl http://localhost:4000/api/health

# Step 1 of login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"bistakusum83@gmail.com","password":"admin123"}'

# Step 2 — exchange OTP for a JWT
curl -X POST http://localhost:4000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"ticket":"U-001","otp":"123456"}'

# Call a protected endpoint (paste the token from the previous response)
curl http://localhost:4000/api/members \
  -H "Authorization: Bearer <PASTE_JWT_HERE>"
```

---

## 📁 Project structure

```
SCMS/
├── README.md                  ← you are here
├── PROJECT_OVERVIEW.md        ← full feature explanation / presentation guide
├── package.json               ← frontend dependencies
├── vite.config.js
├── tailwind.config.js
├── index.html
├── src/                       ← React frontend
│   ├── App.jsx                ← routes + RBAC guards
│   ├── AuthContext.jsx        ← fake auth + MFA state
│   ├── data.js                ← demo seed data (users, members, loans…)
│   ├── lib/finance.js         ← EMI / interest math
│   ├── components/
│   │   ├── Login.jsx          ← MFA login screen
│   │   ├── Layout.jsx         ← sidebar + header + notifications
│   │   └── ui.jsx             ← shared UI primitives
│   └── pages/
│       ├── Dashboard.jsx
│       ├── Members.jsx
│       ├── Savings.jsx
│       ├── Loans.jsx
│       ├── Transactions.jsx
│       ├── Anomalies.jsx
│       ├── Reports.jsx
│       ├── AuditLog.jsx
│       └── Settings.jsx
└── server/                    ← Express backend
    ├── package.json
    ├── server.js              ← app bootstrap (helmet, cors, rate limit, bcrypt)
    ├── data/seed.js           ← in-memory demo data
    ├── middleware/
    │   ├── auth.js            ← JWT sign/verify + RBAC guards
    │   └── audit.js           ← append-only audit logger
    ├── services/anomaly.js    ← rule-based fraud detection engine
    └── routes/
        ├── auth.js
        ├── members.js
        ├── savings.js
        ├── loans.js
        ├── transactions.js
        ├── anomalies.js
        └── audit.js
```

---

## 🛠 Common commands

From the **project root** (frontend):

```bash
npm run dev        # start the React dev server (http://localhost:5173)
npm run build      # production build to /dist
npm run preview    # serve the production build locally
```

From the **`server/`** folder (backend):

```bash
npm start          # start the Express API (http://localhost:4000)
npm run dev        # same, but auto-restart on file changes (Node --watch)
```

---

## 🧩 Troubleshooting

- **Port already in use (5173 or 4000)** — close whatever is using the port, or edit the port in `vite.config.js` (frontend) / `server/server.js` (backend).
- **`npm install` fails** — make sure `node -v` reports 18 or newer.
- **Login says "Invalid credentials"** — remember the admin username is the full email `bistakusum83@gmail.com`, not just `admin`.
- **OTP step rejects the code** — the demo OTP is always `123456`.
- **Backend rate limit kicks in** — the auth endpoints are capped at 10 requests/minute/IP. Wait a minute or restart the server.

---

## 🔐 Security features implemented

- Multi-factor authentication (password → OTP → JWT)
- Role-Based Access Control (`admin`, `accountant`, `member`) enforced on both client and server
- **bcrypt** password hashing (10 salt rounds)
- **JWT** (HS256, 2-hour expiry) on every protected endpoint
- **Helmet** hardened HTTP headers
- **Rate limiting** — 100 req/min global, 10 req/min on `/api/auth/*`
- CORS configured explicitly
- Immutable **audit log** with actor, action, target, IP, status
- Rule-based **anomaly detection** (off-hours high-value, spike vs average, velocity)

See [`PROJECT_OVERVIEW.md`](./PROJECT_OVERVIEW.md) for how each requirement from the capstone specification is addressed.

---

## 📄 License

Academic / demonstration use.
