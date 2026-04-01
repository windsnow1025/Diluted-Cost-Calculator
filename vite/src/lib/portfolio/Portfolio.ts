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
