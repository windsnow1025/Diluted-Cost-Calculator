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

export function fmtRelativeTime(iso: string): string {
  const diffSec = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", {numeric: "auto"});
  if (diffSec < 60) return rtf.format(-diffSec, "second");
  if (diffSec < 3600) return rtf.format(-Math.round(diffSec / 60), "minute");
  if (diffSec < 86400) return rtf.format(-Math.round(diffSec / 3600), "hour");
  return rtf.format(-Math.round(diffSec / 86400), "day");
}
