import type {ActiveHolding, ClosedPosition, PortfolioRow, PortfolioSummary, Transaction} from "./Portfolio";
import type {PriceHistoryBySymbol, PriceBySymbol} from "../prices/PriceClient";
import {computeAvgDailyMarketValue, computeCAGR, computePnlPct} from "./PortfolioStats";
import dilutedCost from "../../data/diluted_cost.json";
import priceHistory from "../../data/price_history.json";
import prices from "../../data/prices.json";
import transactionsData from "../../data/transactions.json";

const priceBySymbol: PriceBySymbol = prices;
const rows: PortfolioRow[] = dilutedCost;

const activeRows = rows.filter((r) => r.shares > 0);
const closedRows = rows.filter((r) => r.shares === 0);

const totalMktValue = activeRows.reduce((sum, r) => sum + priceBySymbol[r.symbol] * r.shares, 0);
const totalDilutedCost = activeRows.reduce((sum, r) => sum + r.netDilutedCost, 0);
const unrealizedPnl = totalMktValue - totalDilutedCost;
const realizedPnl = closedRows.reduce((sum, r) => sum + -r.netDilutedCost, 0);
const totalPnl = unrealizedPnl + realizedPnl;

export const activeHoldings: ActiveHolding[] = activeRows
  .map((r) => {
    const price = priceBySymbol[r.symbol];
    const mktValue = price * r.shares;
    const pnl = mktValue - r.netDilutedCost;
    const pnlPct = computePnlPct(pnl, r.netDilutedCost);
    const weight = (mktValue / totalMktValue) * 100;
    return {...r, price, mktValue, pnl, pnlPct, weight};
  })
  .sort((a, b) => b.mktValue - a.mktValue || a.symbol.localeCompare(b.symbol));

export const closedPositions: ClosedPosition[] = closedRows
  .map((r) => ({symbol: r.symbol, realizedPnl: -r.netDilutedCost}))
  .sort((a, b) => b.realizedPnl - a.realizedPnl || a.symbol.localeCompare(b.symbol));

export const transactions = transactionsData as Transaction[];
export const priceHistoryBySymbol = priceHistory as PriceHistoryBySymbol;

const {avgDailyAssets, totalDays} = computeAvgDailyMarketValue(transactions, priceHistoryBySymbol);
const hasData = avgDailyAssets > 0;
const periodReturn = hasData ? totalPnl / avgDailyAssets : 0;
const totalPnlPct = periodReturn * 100;
const cagrPct = hasData ? computeCAGR(periodReturn, totalDays) : 0;

export const summary: PortfolioSummary = {
  activeCount: activeRows.length,
  closedCount: closedRows.length,
  totalDilutedCost,
  totalMktValue,
  unrealizedPnl,
  realizedPnl,
  totalPnl,
  avgDailyAssets,
  totalPnlPct,
  cagrPct,
};
