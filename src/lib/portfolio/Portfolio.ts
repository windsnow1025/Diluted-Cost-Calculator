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
  unrealizedPnl: number;
  realizedPnl: number;
  totalPnl: number;
  totalPnlPct: number;
  cagrPct: number;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export enum TransactionType {
  Trades = "Trades",
  Dividends = "Dividends",
}

export interface Transaction {
  date: string;
  platform: string;
  type: TransactionType;
  symbol: string;
  quantity?: number;
  price?: number;
  amount: number;
  fees: number;
  taxWithholding: number;
  netAmount: number;
}

export interface RawTransaction {
  date: string;
  platform: string;
  type: TransactionType;
  symbol: string;
  quantity?: number;
  price?: number;
  amount?: number;
  fees: number;
  taxWithholding: number;
}

