import type {ActiveHolding, ClosedPosition, PlatformSummary, PortfolioRow, PortfolioSummary, Transaction} from "./Portfolio";
import type {PriceHistoryBySymbol, PriceBySymbol} from "../prices/PriceClient";
import {BenchmarkSymbol, computeBenchmarkPctSeries, computeDailyPnlSeries, computePnlPct, computeSummary, type BenchmarkPoint, type DailyPnlPoint} from "./PortfolioStats";
import dilutedCost from "../../data/diluted_cost.json";
import priceHistory from "../../data/price_history.json";
import prices from "../../data/prices.json";
import transactionsData from "../../data/transactions.json";

const priceBySymbol: PriceBySymbol = prices;
const rows: PortfolioRow[] = dilutedCost;

const activeRows = rows.filter((r) => r.shares > 0);
const closedRows = rows.filter((r) => r.shares === 0);

export const transactions = transactionsData as Transaction[];
export const priceHistoryBySymbol = priceHistory as PriceHistoryBySymbol;

export const summary: PortfolioSummary = computeSummary(transactions, priceBySymbol, priceHistoryBySymbol);

export const platformSummaries: PlatformSummary[] = Map.groupBy(transactions, (tx) => tx.platform)
  .entries()
  .map(([platform, platformTransactions]) => ({
    platform,
    summary: computeSummary(platformTransactions, priceBySymbol, priceHistoryBySymbol),
  }))
  .toArray()
  .sort((a, b) => b.summary.totalMktValue - a.summary.totalMktValue || a.platform.localeCompare(b.platform));

export const activeHoldings: ActiveHolding[] = activeRows
  .map((r) => {
    const price = priceBySymbol[r.symbol];
    const mktValue = price * r.shares;
    const pnl = mktValue - r.netDilutedCost;
    const pnlPct = computePnlPct(pnl, r.netDilutedCost);
    const weight = (mktValue / summary.totalMktValue) * 100;
    return {...r, price, mktValue, pnl, pnlPct, weight};
  })
  .sort((a, b) => b.mktValue - a.mktValue || a.symbol.localeCompare(b.symbol));

export const closedPositions: ClosedPosition[] = closedRows
  .map((r) => ({symbol: r.symbol, realizedPnl: -r.netDilutedCost}))
  .sort((a, b) => b.realizedPnl - a.realizedPnl || a.symbol.localeCompare(b.symbol));

export const dailyPnlSeries: DailyPnlPoint[] = computeDailyPnlSeries(transactions, priceHistoryBySymbol);

export const benchmarkPctSeries: BenchmarkPoint[] = computeBenchmarkPctSeries(transactions, priceHistoryBySymbol, BenchmarkSymbol);
