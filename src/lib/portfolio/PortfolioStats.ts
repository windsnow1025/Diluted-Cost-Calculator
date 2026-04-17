import {Temporal} from "@js-temporal/polyfill";
import {type Transaction, TransactionType} from "./Portfolio";
import type {PricePoint} from "../prices/PriceClient";

export interface AvgAssetStats {
  avgDailyAssets: number;
  totalDays: number;
}

export function computeCAGR(periodReturn: number, days: number): number {
  return (Math.pow(1 + periodReturn, 365 / days) - 1) * 100;
}

export function computeAvgDailyMarketValue(
  transactions: Transaction[],
  priceHistoryMap: Record<string, PricePoint[]>,
): AvgAssetStats {
  const trades = transactions.filter(
    (tx) => tx.type === TransactionType.Trades && tx.quantity !== undefined,
  );

  if (trades.length === 0) return {avgDailyAssets: 0, totalDays: 0};

  const startDate = Temporal.PlainDate.from(
    trades.map((tx) => tx.date).sort()[0],
  );
  const totalDays = startDate.until(Temporal.Now.plainDateISO("UTC"), {largestUnit: "days"}).days + 1;
  const dayAt = (d: number): string => startDate.add({days: d}).toString();

  const symbols = [...new Set(trades.map((tx) => tx.symbol))];

  // Last Close by Date
  const lastCloseByDate: Record<string, Record<string, number>> = {};
  for (const sym of symbols) {
    lastCloseByDate[sym] = {};
    const byDate: Record<string, number> = {};
    for (const p of priceHistoryMap[sym] ?? []) byDate[p.date] = p.close;
    let last = 0;
    for (let d = 0; d < totalDays; d++) {
      const dayStr = dayAt(d);
      if (byDate[dayStr] !== undefined) last = byDate[dayStr];
      lastCloseByDate[sym][dayStr] = last;
    }
  }

  // Trades by Date
  const tradesByDate: Record<string, Transaction[]> = {};
  for (const tx of trades) {
    (tradesByDate[tx.date] ??= []).push(tx);
  }

  const shares: Record<string, number> = Object.fromEntries(symbols.map((s) => [s, 0]));
  let cumulative = 0;

  for (let d = 0; d < totalDays; d++) {
    const dayStr = dayAt(d);

    // Shares
    for (const tx of tradesByDate[dayStr] ?? []) {
      shares[tx.symbol] += tx.quantity!;
    }

    // Cumulative
    let dayValue = 0;
    for (const sym of symbols) {
      if (shares[sym] > 0) dayValue += shares[sym] * lastCloseByDate[sym][dayStr];
    }
    cumulative += dayValue;
  }

  return {avgDailyAssets: cumulative / totalDays, totalDays};
}
