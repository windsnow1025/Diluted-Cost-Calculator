import type {ActiveHolding, ClosedPosition, PlatformSummary, PortfolioSummary, Position, Transaction} from "./Portfolio";
import type {PriceHistoryBySymbol, PriceBySymbol} from "../prices/PriceClient";
import {BenchmarkSymbol, computeBenchmarkPctSeries, computeDailyPnlSeries, computePnlPct, computeSummary, type BenchmarkPoint, type DailyPnlPoint} from "./PortfolioStats";
import dilutedCost from "../../data/diluted_cost.json";
import priceHistory from "../../data/price_history.json";
import prices from "../../data/prices.json";
import transactionsData from "../../data/transactions.json";

const priceBySymbol: PriceBySymbol = prices;
const positions: Position[] = dilutedCost;

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

export const activeHoldings: ActiveHolding[] = positions
  .filter((p) => p.shares > 0)
  .map((p) => {
    const price = priceBySymbol[p.symbol];
    const mktValue = price * p.shares;
    const pnl = mktValue - p.netDilutedCost;
    const pnlPct = computePnlPct(pnl, p.netDilutedCost);
    const weight = (mktValue / summary.totalMktValue) * 100;
    return {...p, price, mktValue, pnl, pnlPct, weight};
  })
  .sort((a, b) => b.mktValue - a.mktValue || a.symbol.localeCompare(b.symbol));

export const closedPositions: ClosedPosition[] = positions
  .filter((p) => p.shares === 0)
  .map((p) => ({symbol: p.symbol, realizedPnl: -p.netDilutedCost}))
  .sort((a, b) => b.realizedPnl - a.realizedPnl || a.symbol.localeCompare(b.symbol));

export const dailyPnlSeries: DailyPnlPoint[] = computeDailyPnlSeries(transactions, priceHistoryBySymbol);

export const benchmarkPctSeries: BenchmarkPoint[] = computeBenchmarkPctSeries(transactions, priceHistoryBySymbol, BenchmarkSymbol);
