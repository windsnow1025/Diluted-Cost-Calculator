export function fmtDollar(n: number): string {
  if (n < 0) return `-$${(-n).toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  return `$${n.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

export function fmtPct(n: number): string {
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

export function pnlColor(n: number): string {
  return n >= 0 ? "success.main" : "error.main";
}
