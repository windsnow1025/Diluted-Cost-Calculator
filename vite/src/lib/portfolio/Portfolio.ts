export interface PortfolioRow {
  symbol: string;
  shares: number;
  netDilutedCost: number;
  dilutedCostPerShare: number | null;
}

export interface ActiveHolding extends PortfolioRow {
  price: number;
  mktValue: number;
  pnl: number;
  pnlPct: number;
  weight: number;
}

export interface ClosedPosition {
  symbol: string;
  realizedPnl: number;
}

export interface PortfolioSummary {
  activeCount: number;
  closedCount: number;
  totalDilutedCost: number;
  totalMktValue: number;
  totalPnl: number;
  totalPnlPct: number;
}

export enum TransactionType {
  Trades = "Trades",
  Dividends = "Dividends",
}

export interface Transaction {
  date: string;
  platform: string;
  type: TransactionType;
  symbol: string;
  quantity: number | null;
  price: number | null;
  amount: number;
  fees: number;
  taxWithholding: number;
  netAmount: number;
}

export interface PricePoint {
  date: string;
  close: number;
}
