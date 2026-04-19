// Finance helpers used across the SCMS frontend.

// Calculate monthly EMI using the reducing-balance formula:
//   EMI = P * r * (1+r)^n / ((1+r)^n - 1)
// where r = monthly rate, n = term in months.
export function calcEmi(principal, annualRatePct, termMonths) {
  if (!principal || !annualRatePct || !termMonths) return 0;
  const r = annualRatePct / 12 / 100;
  const pow = Math.pow(1 + r, termMonths);
  return (principal * r * pow) / (pow - 1);
}

// Total interest paid over the life of the loan
export function totalInterest(principal, annualRatePct, termMonths) {
  return calcEmi(principal, annualRatePct, termMonths) * termMonths - principal;
}

// Build an amortization schedule (used in loan detail views / reports).
export function amortization(principal, annualRatePct, termMonths) {
  const emi = calcEmi(principal, annualRatePct, termMonths);
  const r = annualRatePct / 12 / 100;
  let balance = principal;
  const rows = [];
  for (let i = 1; i <= termMonths; i++) {
    const interest = balance * r;
    const principalPaid = emi - interest;
    balance = Math.max(0, balance - principalPaid);
    rows.push({ month: i, emi, interest, principal: principalPaid, balance });
  }
  return rows;
}
