import type {ActiveHolding, ClosedPosition, PricePoint, PortfolioRow, PortfolioSummary, Transaction} from "./Portfolio";
import dilutedCost from "../../data/diluted_cost.json";
import priceHistory from "../../data/price_history.json";
import prices from "../../data/prices.json";
import transactionsData from "../../data/transactions.json";

const priceMap: Record<string, number> = prices;
const rows: PortfolioRow[] = dilutedCost;

const activeRows = rows.filter((r) => r.shares > 0);
const closedRows = rows.filter((r) => r.shares === 0);

const totalMktValue = activeRows.reduce((sum, r) => sum + priceMap[r.symbol] * r.shares, 0);
const totalDilutedCost = activeRows.reduce((s, r) => s + r.netDilutedCost, 0);
const totalPnl = totalMktValue - totalDilutedCost;

export const activeHoldings: ActiveHolding[] = activeRows
  .map((r) => {
    const price = priceMap[r.symbol];
    const mktValue = price * r.shares;
    const pnl = mktValue - r.netDilutedCost;
    const pnlPct = (pnl / r.netDilutedCost) * 100;
    const weight = (mktValue / totalMktValue) * 100;
    return {...r, price, mktValue, pnl, pnlPct, weight};
  })
  .sort((a, b) => b.mktValue - a.mktValue || a.symbol.localeCompare(b.symbol));

export const closedPositions: ClosedPosition[] = closedRows
  .map((r) => ({symbol: r.symbol, realizedPnl: -r.netDilutedCost}))
  .sort((a, b) => b.realizedPnl - a.realizedPnl || a.symbol.localeCompare(b.symbol));

export const transactions: Transaction[] = transactionsData;
export const priceHistoryMap: Record<string, PricePoint[]> = priceHistory;

export const summary: PortfolioSummary = {
  activeCount: activeRows.length,
  closedCount: closedRows.length,
  totalDilutedCost,
  totalMktValue,
  totalPnl,
  totalPnlPct: (totalPnl / totalDilutedCost) * 100,
};
