import {Temporal} from "@js-temporal/polyfill";
import {type Transaction, TransactionType} from "./Portfolio";
import type {PriceBySymbol, PriceHistoryBySymbol} from "../prices/PriceClient";

export interface AvgAssetStats {
  avgDailyAssets: number;
  totalDays: number;
}

export function computeCAGR(periodReturn: number, days: number): number {
  return (Math.pow(1 + periodReturn, 365 / days) - 1) * 100;
}

export function computePnlPct(pnl: number, netDilutedCost: number): number | null {
  if (netDilutedCost <= 0) return null;
  return (pnl / netDilutedCost) * 100;
}

export function computeLastCloseBySymbolByDate(
  symbols: string[],
  priceHistoryBySymbol: PriceHistoryBySymbol,
  days: string[],
): {[date: string]: PriceBySymbol} {
  const lastCloseBySymbolByDate: {[date: string]: PriceBySymbol} = {};
  for (const day of days) lastCloseBySymbolByDate[day] = {};
  for (const sym of symbols) {
    const closeByDate: Record<string, number> = {};
    for (const pricePoint of priceHistoryBySymbol[sym] ?? []) {
      closeByDate[pricePoint.date] = pricePoint.close;
    }
    let lastClose = 0;
    for (const day of days) {
      if (closeByDate[day] !== undefined) lastClose = closeByDate[day];
      lastCloseBySymbolByDate[day][sym] = lastClose;
    }
  }
  return lastCloseBySymbolByDate;
}

export function computeAvgDailyMarketValue(
  transactions: Transaction[],
  priceHistoryBySymbol: PriceHistoryBySymbol,
): AvgAssetStats {
  const trades = transactions.filter(
    (tx) => tx.type === TransactionType.Trades && tx.quantity !== undefined,
  );

  if (trades.length === 0) return {avgDailyAssets: 0, totalDays: 0};

  const startDate = Temporal.PlainDate.from(
    trades.map((tx) => tx.date).sort()[0],
  );
  const totalDays = startDate.until(Temporal.Now.plainDateISO("UTC"), {largestUnit: "days"}).days + 1;
  const days = Array.from({length: totalDays}, (_, d) => startDate.add({days: d}).toString());

  const symbols = [...new Set(trades.map((tx) => tx.symbol))];

  const lastCloseBySymbolByDate = computeLastCloseBySymbolByDate(symbols, priceHistoryBySymbol, days);

  // Trades by Date
  const tradesByDate = Object.groupBy(trades, (tx) => tx.date);

  const sharesBySymbol: Record<string, number> = Object.fromEntries(symbols.map((s) => [s, 0]));
  let cumulative = 0;

  for (const day of days) {
    // Shares
    for (const tx of tradesByDate[day] ?? []) {
      sharesBySymbol[tx.symbol] += tx.quantity!;
    }

    // Cumulative
    let dayValue = 0;
    for (const sym of symbols) {
      if (sharesBySymbol[sym] > 0) dayValue += sharesBySymbol[sym] * lastCloseBySymbolByDate[day][sym];
    }
    cumulative += dayValue;
  }

  return {avgDailyAssets: cumulative / totalDays, totalDays};
}
