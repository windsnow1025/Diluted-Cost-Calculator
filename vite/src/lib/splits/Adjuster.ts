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

    const txDate = tx.date.split(" ")[0];
    let multiplier = 1;
    for (const split of splits) {
      if (split.date > txDate) {
        multiplier *= split.ratio;
      }
    }

    return {
      ...tx,
      quantity: tx.quantity !== null ? tx.quantity * multiplier : null,
      price: tx.price !== null ? tx.price / multiplier : null,
    };
  });
}
