// In-memory seed data for SCMS backend demo
// NOTE: Passwords here are bcrypt hashes of the plaintext shown in `plain` comments.
// They are generated on server boot (see server.js) to keep this file readable.

export const USERS = [
  { id: "U-001", username: "bistakusum83@gmail.com", role: "admin",      name: "Kusum Bista",   email: "bistakusum83@gmail.com", otp: "123456", plain: "admin123" },
  { id: "U-002", username: "accountant", role: "accountant", name: "Priya Khadka",  email: "accountant@scms.coop", otp: "123456", plain: "acc123"   },
  { id: "U-003", username: "member",     role: "member",     name: "Sanil Dulal",   email: "sanil@scms.coop",      otp: "123456", plain: "mem123"   },
];

export const MEMBERS = [
  { id: "M-1001", name: "Sanil Dulal",      email: "sanil@scms.coop",   phone: "+977-9801111111", joined: "2023-04-12", kyc: "Verified", status: "Active", savings: 125400, loans: 50000  },
  { id: "M-1002", name: "Kusum Poudel",     email: "kusum@scms.coop",   phone: "+977-9802222222", joined: "2023-06-02", kyc: "Verified", status: "Active", savings: 84200,  loans: 0      },
  { id: "M-1003", name: "Nabin Thapa",      email: "nabin@scms.coop",   phone: "+977-9803333333", joined: "2024-01-18", kyc: "Pending",  status: "Active", savings: 12500,  loans: 0      },
  { id: "M-1004", name: "Sita Gurung",      email: "sita@scms.coop",    phone: "+977-9804444444", joined: "2022-11-30", kyc: "Verified", status: "Active", savings: 210000, loans: 150000 },
  { id: "M-1005", name: "Ramesh Koirala",   email: "ramesh@scms.coop",  phone: "+977-9805555555", joined: "2024-03-22", kyc: "Verified", status: "Frozen", savings: 3400,   loans: 0      },
  { id: "M-1006", name: "Anjali Bhattarai", email: "anjali@scms.coop",  phone: "+977-9806666666", joined: "2021-08-09", kyc: "Verified", status: "Active", savings: 345000, loans: 200000 },
  { id: "M-1007", name: "Bikash Lama",      email: "bikash@scms.coop",  phone: "+977-9807777777", joined: "2025-01-05", kyc: "Pending",  status: "Active", savings: 5000,   loans: 0      },
  { id: "M-1008", name: "Manisha Rai",      email: "manisha@scms.coop", phone: "+977-9808888888", joined: "2023-09-17", kyc: "Verified", status: "Active", savings: 68900,  loans: 25000  },
];

export const LOANS = [
  { id: "L-9001", member: "Sanil Dulal",      amount: 50000,  rate: 12, term: 12, status: "Active",    nextDue: "2026-05-01", balance: 32000  },
  { id: "L-9002", member: "Sita Gurung",      amount: 150000, rate: 10, term: 24, status: "Active",    nextDue: "2026-05-10", balance: 98000  },
  { id: "L-9003", member: "Anjali Bhattarai", amount: 200000, rate: 11, term: 36, status: "Active",    nextDue: "2026-04-28", balance: 172000 },
  { id: "L-9004", member: "Manisha Rai",      amount: 25000,  rate: 12, term: 6,  status: "Pending",   nextDue: "-",          balance: 25000  },
  { id: "L-9005", member: "Kusum Poudel",     amount: 40000,  rate: 10, term: 12, status: "Completed", nextDue: "-",          balance: 0      },
];

export const TRANSACTIONS = [
  { id: "T-5001", date: "2026-04-18 10:22", member: "Sanil Dulal",      type: "Deposit",    amount: 5000,   channel: "Branch" },
  { id: "T-5002", date: "2026-04-18 11:05", member: "Kusum Poudel",     type: "Withdrawal", amount: 2000,   channel: "ATM"    },
  { id: "T-5003", date: "2026-04-18 14:41", member: "Sita Gurung",      type: "Loan Repay", amount: 8500,   channel: "Online" },
  { id: "T-5004", date: "2026-04-18 23:58", member: "Anjali Bhattarai", type: "Withdrawal", amount: 180000, channel: "Online" },
  { id: "T-5005", date: "2026-04-19 08:15", member: "Ramesh Koirala",   type: "Deposit",    amount: 1500,   channel: "Branch" },
  { id: "T-5006", date: "2026-04-19 09:03", member: "Sanil Dulal",      type: "Transfer",   amount: 95000,  channel: "Online" },
  { id: "T-5007", date: "2026-04-19 09:42", member: "Manisha Rai",      type: "Deposit",    amount: 3000,   channel: "Mobile" },
  { id: "T-5008", date: "2026-04-19 10:10", member: "Nabin Thapa",      type: "Withdrawal", amount: 500,    channel: "ATM"    },
  { id: "T-5009", date: "2026-04-19 10:55", member: "Bikash Lama",      type: "Deposit",    amount: 500,    channel: "Mobile" },
  { id: "T-5010", date: "2026-04-19 11:30", member: "Anjali Bhattarai", type: "Loan Repay", amount: 12000,  channel: "Online" },
];

export const AUDIT_LOGS = [
  { id: "A-1", ts: "2026-04-19 11:32", actor: "admin",      action: "UPDATE_MEMBER",    target: "M-1005", ip: "10.0.0.14",   status: "success" },
  { id: "A-2", ts: "2026-04-19 11:05", actor: "accountant", action: "APPROVE_LOAN",     target: "L-9004", ip: "10.0.0.22",   status: "success" },
  { id: "A-3", ts: "2026-04-18 22:14", actor: "unknown",    action: "LOGIN_FAILED",     target: "admin",  ip: "185.12.4.91", status: "alert"   },
  { id: "A-4", ts: "2026-04-18 22:13", actor: "unknown",    action: "LOGIN_FAILED",     target: "admin",  ip: "185.12.4.91", status: "alert"   },
  { id: "A-5", ts: "2026-04-18 18:41", actor: "accountant", action: "POST_TRANSACTION", target: "T-5003", ip: "10.0.0.22",   status: "success" },
  { id: "A-6", ts: "2026-04-18 14:10", actor: "admin",      action: "CREATE_MEMBER",    target: "M-1008", ip: "10.0.0.14",   status: "success" },
  { id: "A-7", ts: "2026-04-18 09:01", actor: "admin",      action: "LOGIN_SUCCESS",    target: "admin",  ip: "10.0.0.14",   status: "success" },
];
