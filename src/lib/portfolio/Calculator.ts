import {type PortfolioRow, type Transaction, TransactionType} from "./Portfolio";

interface Accumulator {
  shares: number;
  netDilutedCost: number;
}

export function calculateDilutedCosts(transactions: Transaction[]): PortfolioRow[] {
  const symbols = new Map<string, Accumulator>();

  for (const tx of transactions) {
    let acc = symbols.get(tx.symbol);
    if (!acc) {
      acc = {shares: 0, netDilutedCost: 0};
      symbols.set(tx.symbol, acc);
    }

    if (tx.type === TransactionType.Trades) {
      acc.shares += tx.quantity!;
    }

    acc.netDilutedCost += tx.netAmount;
  }

  const results: PortfolioRow[] = [];
  for (const symbol of [...symbols.keys()].sort()) {
    const acc = symbols.get(symbol)!;
    const dilutedCostPerShare = acc.shares !== 0 ? acc.netDilutedCost / acc.shares : null;
    results.push({
      symbol: symbol,
      shares: acc.shares,
      netDilutedCost: acc.netDilutedCost,
      dilutedCostPerShare: dilutedCostPerShare,
    });
  }

  return results;
}
