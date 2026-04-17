import type {RawTransaction} from "./Portfolio";

function cmpStr(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function cmpOptional(a: number | undefined, b: number | undefined): number {
  if (a === b) return 0;
  if (a === undefined) return -1;
  if (b === undefined) return 1;
  return a - b;
}

function compareTransactions(a: RawTransaction, b: RawTransaction): number {
  return (
    cmpStr(a.date, b.date) ||
    cmpStr(a.platform, b.platform) ||
    cmpStr(a.type, b.type) ||
    cmpStr(a.symbol, b.symbol) ||
    cmpOptional(a.quantity, b.quantity) ||
    cmpOptional(a.price, b.price) ||
    cmpOptional(a.amount, b.amount) ||
    (a.fees - b.fees) ||
    (a.taxWithholding - b.taxWithholding)
  );
}

export function sortTransactions(transactions: RawTransaction[]): RawTransaction[] {
  return transactions.slice().sort(compareTransactions);
}
