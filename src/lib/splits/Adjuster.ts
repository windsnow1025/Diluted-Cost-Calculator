import {TransactionType, type Transaction} from "../portfolio/Portfolio";
import type {SplitEvent} from "./SplitsClient";

export function adjustForSplits(
  transactions: Transaction[],
  splitsBySymbol: Record<string, SplitEvent[]>,
): Transaction[] {
  return transactions.map((tx) => {
    if (tx.type !== TransactionType.Trades) return tx;
    const splits = splitsBySymbol[tx.symbol];
    if (!splits) return tx;

    let multiplier = 1;
    for (const split of splits) {
      if (split.date > tx.date) {
        multiplier *= split.ratio;
      }
    }

    return {
      ...tx,
      quantity: tx.quantity !== undefined ? tx.quantity * multiplier : undefined,
      price: tx.price !== undefined ? tx.price / multiplier : undefined,
    };
  });
}
