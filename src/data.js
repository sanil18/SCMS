// Hardcoded demo data for SCMS

export const USERS = [
  {
    id: "U-001",
    username: "admin@scms.coop",
    password: "admin123",
    otp: "123456",
    name: "Kusum Bista",
    role: "admin",
    email: "admin@scms.coop",
    avatar: "KB",
  },
  {
    id: "U-002",
    username: "accountant@scms.coop",
    password: "acc123",
    otp: "123456",
    name: "Priya Khadka",
    role: "accountant",
    email: "accountant@scms.coop",
    avatar: "PK",
  },
  {
    id: "U-003",
    username: "member@scms.coop",
    password: "mem123",
    otp: "123456",
    name: "Sanil Dulal",
    role: "member",
    email: "sanil@scms.coop",
    avatar: "SD",
  },
];

export const MEMBERS = [
  { id: "M-1001", name: "Sanil Dulal",       email: "sanil@scms.coop",     phone: "+977-9801111111", joined: "2023-04-12", kyc: "Verified",  status: "Active",  savings: 125400, loans: 50000 },
  { id: "M-1002", name: "Kusum Poudel",      email: "kusum@scms.coop",     phone: "+977-9802222222", joined: "2023-06-02", kyc: "Verified",  status: "Active",  savings: 84200,  loans: 0 },
  { id: "M-1003", name: "Nabin Thapa",       email: "nabin@scms.coop",     phone: "+977-9803333333", joined: "2024-01-18", kyc: "Pending",   status: "Active",  savings: 12500,  loans: 0 },
  { id: "M-1004", name: "Sita Gurung",       email: "sita@scms.coop",      phone: "+977-9804444444", joined: "2022-11-30", kyc: "Verified",  status: "Active",  savings: 210000, loans: 150000 },
  { id: "M-1005", name: "Ramesh Koirala",    email: "ramesh@scms.coop",    phone: "+977-9805555555", joined: "2024-03-22", kyc: "Verified",  status: "Frozen",  savings: 3400,   loans: 0 },
  { id: "M-1006", name: "Anjali Bhattarai",  email: "anjali@scms.coop",    phone: "+977-9806666666", joined: "2021-08-09", kyc: "Verified",  status: "Active",  savings: 345000, loans: 200000 },
  { id: "M-1007", name: "Bikash Lama",       email: "bikash@scms.coop",    phone: "+977-9807777777", joined: "2025-01-05", kyc: "Pending",   status: "Active",  savings: 5000,   loans: 0 },
  { id: "M-1008", name: "Manisha Rai",       email: "manisha@scms.coop",   phone: "+977-9808888888", joined: "2023-09-17", kyc: "Verified",  status: "Active",  savings: 68900,  loans: 25000 },
];

export const LOANS = [
  { id: "L-9001", member: "Sanil Dulal",      amount: 50000,  rate: 12, term: 12, status: "Active",    nextDue: "2026-05-01", balance: 32000 },
  { id: "L-9002", member: "Sita Gurung",      amount: 150000, rate: 10, term: 24, status: "Active",    nextDue: "2026-05-10", balance: 98000 },
  { id: "L-9003", member: "Anjali Bhattarai", amount: 200000, rate: 11, term: 36, status: "Active",    nextDue: "2026-04-28", balance: 172000 },
  { id: "L-9004", member: "Manisha Rai",      amount: 25000,  rate: 12, term: 6,  status: "Pending",   nextDue: "-",          balance: 25000 },
  { id: "L-9005", member: "Kusum Poudel",     amount: 40000,  rate: 10, term: 12, status: "Completed", nextDue: "-",          balance: 0 },
];

export const TRANSACTIONS = [
  { id: "T-5001", date: "2026-04-18 10:22", member: "Sanil Dulal",      type: "Deposit",    amount: 5000,   channel: "Branch",    flagged: false },
  { id: "T-5002", date: "2026-04-18 11:05", member: "Kusum Poudel",     type: "Withdrawal", amount: 2000,   channel: "ATM",       flagged: false },
  { id: "T-5003", date: "2026-04-18 14:41", member: "Sita Gurung",      type: "Loan Repay", amount: 8500,   channel: "Online",    flagged: false },
  { id: "T-5004", date: "2026-04-18 23:58", member: "Anjali Bhattarai", type: "Withdrawal", amount: 180000, channel: "Online",    flagged: true,  reason: "Unusual hour + high amount" },
  { id: "T-5005", date: "2026-04-19 08:15", member: "Ramesh Koirala",   type: "Deposit",    amount: 1500,   channel: "Branch",    flagged: false },
  { id: "T-5006", date: "2026-04-19 09:03", member: "Sanil Dulal",      type: "Transfer",   amount: 95000,  channel: "Online",    flagged: true,  reason: "Spike vs. 30-day avg (12x)" },
  { id: "T-5007", date: "2026-04-19 09:42", member: "Manisha Rai",      type: "Deposit",    amount: 3000,   channel: "Mobile",    flagged: false },
  { id: "T-5008", date: "2026-04-19 10:10", member: "Nabin Thapa",      type: "Withdrawal", amount: 500,    channel: "ATM",       flagged: false },
  { id: "T-5009", date: "2026-04-19 10:55", member: "Bikash Lama",      type: "Deposit",    amount: 500,    channel: "Mobile",    flagged: false },
  { id: "T-5010", date: "2026-04-19 11:30", member: "Anjali Bhattarai", type: "Loan Repay", amount: 12000,  channel: "Online",    flagged: false },
];

export const AUDIT_LOGS = [
  { id: "A-1", ts: "2026-04-19 11:32", actor: "admin",      action: "UPDATE_MEMBER",    target: "M-1005", ip: "10.0.0.14",  status: "success" },
  { id: "A-2", ts: "2026-04-19 11:05", actor: "accountant", action: "APPROVE_LOAN",     target: "L-9004", ip: "10.0.0.22",  status: "success" },
  { id: "A-3", ts: "2026-04-19 09:03", actor: "system",     action: "ANOMALY_FLAGGED",  target: "T-5006", ip: "-",          status: "alert" },
  { id: "A-4", ts: "2026-04-18 23:59", actor: "system",     action: "ANOMALY_FLAGGED",  target: "T-5004", ip: "-",          status: "alert" },
  { id: "A-5", ts: "2026-04-18 22:14", actor: "unknown",    action: "LOGIN_FAILED",     target: "admin",  ip: "185.12.4.91",status: "alert" },
  { id: "A-6", ts: "2026-04-18 22:13", actor: "unknown",    action: "LOGIN_FAILED",     target: "admin",  ip: "185.12.4.91",status: "alert" },
  { id: "A-7", ts: "2026-04-18 18:41", actor: "accountant", action: "POST_TRANSACTION", target: "T-5003", ip: "10.0.0.22",  status: "success" },
  { id: "A-8", ts: "2026-04-18 14:10", actor: "admin",      action: "CREATE_MEMBER",    target: "M-1008", ip: "10.0.0.14",  status: "success" },
  { id: "A-9", ts: "2026-04-18 09:01", actor: "admin",      action: "LOGIN_SUCCESS",    target: "admin",  ip: "10.0.0.14",  status: "success" },
];

export const MONTHLY_STATS = [
  { month: "Nov", deposits: 420000, withdrawals: 210000, loans: 150000 },
  { month: "Dec", deposits: 465000, withdrawals: 240000, loans: 180000 },
  { month: "Jan", deposits: 510000, withdrawals: 265000, loans: 220000 },
  { month: "Feb", deposits: 495000, withdrawals: 255000, loans: 260000 },
  { month: "Mar", deposits: 540000, withdrawals: 290000, loans: 310000 },
  { month: "Apr", deposits: 585000, withdrawals: 310000, loans: 340000 },
];

export const NAV = {
  admin: ["dashboard", "members", "staff", "savings", "loans", "transactions", "dayend", "vault", "anomalies", "reports", "audit", "settings"],
  accountant: ["dashboard", "members", "savings", "loans", "transactions", "dayend", "vault", "anomalies", "reports"],
  member: ["dashboard", "savings", "loans", "transactions", "vault"],
};

// Staff accounts managed by admin (Accountants / Managers)
export const STAFF = [
  { id: "S-01", name: "Priya Khadka",   email: "priya@scms.coop",   role: "Accountant", status: "Active",   joined: "2022-08-10", lastLogin: "Today 09:12" },
  { id: "S-02", name: "Rohan Shrestha", email: "rohan@scms.coop",   role: "Manager",    status: "Active",   joined: "2021-03-22", lastLogin: "Today 08:45" },
  { id: "S-03", name: "Nisha Tamang",   email: "nisha@scms.coop",   role: "Accountant", status: "Suspended",joined: "2023-11-02", lastLogin: "3 days ago" },
];

// Digital document vault (KYC docs, statements, receipts)
export const DOCUMENTS = [
  { id: "D-001", member: "Sanil Dulal",       name: "Citizenship_Front.pdf",   type: "KYC",        size: "312 KB", uploaded: "2023-04-12" },
  { id: "D-002", member: "Sanil Dulal",       name: "Citizenship_Back.pdf",    type: "KYC",        size: "298 KB", uploaded: "2023-04-12" },
  { id: "D-003", member: "Sanil Dulal",       name: "Statement_Apr2026.pdf",   type: "Statement",  size: "88 KB",  uploaded: "2026-04-01" },
  { id: "D-004", member: "Sita Gurung",       name: "Loan_Agreement_L9002.pdf",type: "Loan Doc",   size: "512 KB", uploaded: "2024-06-18" },
  { id: "D-005", member: "Anjali Bhattarai",  name: "KYC_Passport.pdf",        type: "KYC",        size: "420 KB", uploaded: "2021-08-09" },
  { id: "D-006", member: "Manisha Rai",       name: "Income_Proof.pdf",        type: "KYC",        size: "245 KB", uploaded: "2024-10-04" },
  { id: "D-007", member: "Kusum Poudel",      name: "Statement_Apr2026.pdf",   type: "Statement",  size: "76 KB",  uploaded: "2026-04-01" },
];

// Per-member passbook (Date · Description · Debit · Credit · Running Balance)
export const PASSBOOKS = {
  "Sanil Dulal": [
    { date: "2026-03-01", desc: "Opening balance",             debit: 0,    credit: 0,     balance: 118900 },
    { date: "2026-03-15", desc: "Salary deposit",              debit: 0,    credit: 15000, balance: 133900 },
    { date: "2026-03-28", desc: "ATM withdrawal",              debit: 8500, credit: 0,     balance: 125400 },
    { date: "2026-04-18", desc: "Deposit · T-5001",            debit: 0,    credit: 5000,  balance: 130400 },
    { date: "2026-04-19", desc: "Online transfer · T-5006",    debit: 95000,credit: 0,     balance: 35400  },
  ],
  "Sita Gurung": [
    { date: "2026-03-01", desc: "Opening balance",             debit: 0,    credit: 0,     balance: 218500 },
    { date: "2026-03-10", desc: "Loan repayment · L-9002",     debit: 8500, credit: 0,     balance: 210000 },
    { date: "2026-04-18", desc: "Loan repayment · T-5003",     debit: 8500, credit: 0,     balance: 201500 },
  ],
  "Kusum Poudel": [
    { date: "2026-03-01", desc: "Opening balance",             debit: 0,    credit: 0,     balance: 86200 },
    { date: "2026-04-18", desc: "ATM withdrawal · T-5002",     debit: 2000, credit: 0,     balance: 84200 },
  ],
};

// Admin-configurable system settings (fraud thresholds, loan products)
export const DEFAULT_CONFIG = {
  savingsRate: 6.5,      // % p.a.
  loanRate: 12.0,        // % p.a. base
  penaltyRate: 2.0,      // % per overdue month
  maxLoanTerm: 36,       // months
  maxLoanAmount: 500000, // NPR
  fraudSpikeMultiplier: 10,   // flag if tx > 10x of 30-day average
  fraudHighAmount: 100000,    // NPR
  fraudNightHourStart: 22,    // 10pm
  fraudNightHourEnd: 5,       // 5am
  mfaRequired: true,
};

export const NOTIFICATIONS = [
  { id: "N-1", type: "alert",   title: "Suspicious transaction flagged",  body: "T-5006 · NPR 95,000 transfer by Sanil Dulal — 12× above average.", time: "2m ago", channel: "system" },
  { id: "N-2", type: "alert",   title: "Failed login attempt",            body: "3 failed attempts on account 'bistakusum83@gmail.com' from IP 185.12.4.91.", time: "14m ago", channel: "email" },
  { id: "N-3", type: "info",    title: "Loan application received",       body: "Manisha Rai applied for NPR 25,000 — awaiting accountant review.", time: "1h ago", channel: "email" },
  { id: "N-4", type: "success", title: "SMS alert delivered",             body: "Deposit confirmation sent to +977-9801111111 for T-5001.", time: "3h ago", channel: "sms" },
  { id: "N-5", type: "info",    title: "Monthly report ready",            body: "April cooperative performance report has been generated.", time: "1d ago", channel: "system" },
];
