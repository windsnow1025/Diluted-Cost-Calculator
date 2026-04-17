import type {Transaction} from "./Portfolio";

function cmpStr(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function cmpNullable(a: number | null, b: number | null): number {
  if (a === b) return 0;
  if (a === null) return -1;
  if (b === null) return 1;
  return a - b;
}

function compareTransactions(a: Transaction, b: Transaction): number {
  return (
    cmpStr(a.date, b.date) ||
    cmpStr(a.platform, b.platform) ||
    cmpStr(a.type, b.type) ||
    cmpStr(a.symbol, b.symbol) ||
    cmpNullable(a.quantity, b.quantity) ||
    cmpNullable(a.price, b.price) ||
    (a.amount - b.amount) ||
    (a.fees - b.fees) ||
    (a.taxWithholding - b.taxWithholding) ||
    (a.netAmount - b.netAmount)
  );
}

export function sortTransactions(transactions: Transaction[]): Transaction[] {
  return transactions.slice().sort(compareTransactions);
}
