import {Temporal} from "@js-temporal/polyfill";
import {type Transaction, TransactionType} from "./Portfolio";
import type {PriceBySymbol, PriceHistoryBySymbol} from "../prices/PriceClient";

export interface AvgAssetStats {
  avgDailyAssets: number;
  totalDays: number;
}

export interface DailyPnlPoint {
  date: string;
  mktValue: number;
  netDilutedCost: number;
  pnl: number;
}

export function computeCAGR(periodReturn: number, days: number): number {
  return (Math.pow(1 + periodReturn, 365 / days) - 1) * 100;
}

export function computePnlPct(pnl: number, netDilutedCost: number): number | null {
  if (netDilutedCost <= 0) return null;
  return (pnl / netDilutedCost) * 100;
}

export function enumerateDays(startDate: Temporal.PlainDate): string[] {
  const totalDays = startDate.until(Temporal.Now.plainDateISO("UTC"), {largestUnit: "days"}).days + 1;
  return Array.from({length: totalDays}, (_, d) => startDate.add({days: d}).toString());
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

export function computeDailyMarketValues(
  trades: Transaction[],
  days: string[],
  lastCloseBySymbolByDate: {[date: string]: PriceBySymbol},
): number[] {
  const symbols = [...new Set(trades.map((tx) => tx.symbol))];
  const tradesByDate = Object.groupBy(trades, (tx) => tx.date);
  const sharesBySymbol: Record<string, number> = Object.fromEntries(symbols.map((s) => [s, 0]));

  const dailyMarketValues: number[] = [];
  for (const day of days) {
    // Shares
    for (const tx of tradesByDate[day] ?? []) {
      sharesBySymbol[tx.symbol] += tx.quantity!;
    }

    // Market Value
    let dayValue = 0;
    for (const sym of symbols) {
      if (sharesBySymbol[sym] > 0) dayValue += sharesBySymbol[sym] * lastCloseBySymbolByDate[day][sym];
    }
    dailyMarketValues.push(dayValue);
  }

  return dailyMarketValues;
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
  const days = enumerateDays(startDate);

  const symbols = [...new Set(trades.map((tx) => tx.symbol))];

  const lastCloseBySymbolByDate = computeLastCloseBySymbolByDate(symbols, priceHistoryBySymbol, days);

  const dailyMarketValues = computeDailyMarketValues(trades, days, lastCloseBySymbolByDate);
  const cumulative = dailyMarketValues.reduce((sum, value) => sum + value, 0);

  return {avgDailyAssets: cumulative / days.length, totalDays: days.length};
}

export function computeDailyPnlSeries(
  transactions: Transaction[],
  priceHistoryBySymbol: PriceHistoryBySymbol,
): DailyPnlPoint[] {
  if (transactions.length === 0) return [];

  const startDate = Temporal.PlainDate.from(
    transactions.map((tx) => tx.date).sort()[0],
  );
  const days = enumerateDays(startDate);

  const trades = transactions.filter(
    (tx) => tx.type === TransactionType.Trades && tx.quantity !== undefined,
  );
  const symbols = [...new Set(trades.map((tx) => tx.symbol))];

  const lastCloseBySymbolByDate = computeLastCloseBySymbolByDate(symbols, priceHistoryBySymbol, days);

  const dailyMarketValues = computeDailyMarketValues(trades, days, lastCloseBySymbolByDate);

  const transactionsByDate = Object.groupBy(transactions, (tx) => tx.date);

  const series: DailyPnlPoint[] = [];
  let netDilutedCost = 0;
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    for (const tx of transactionsByDate[day] ?? []) {
      netDilutedCost += tx.netAmount;
    }
    const mktValue = dailyMarketValues[i];
    series.push({date: day, mktValue, netDilutedCost, pnl: mktValue - netDilutedCost});
  }

  return series;
}
