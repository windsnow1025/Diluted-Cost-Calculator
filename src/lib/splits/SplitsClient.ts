import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

// Excludes spin-off price adjustment factors
const MaxShareSplitTerm = 100;

export interface SplitEvent {
  date: string;
  ratio: number;
}

export async function fetchSplits(symbols: string[]): Promise<Record<string, SplitEvent[]>> {
  const result: Record<string, SplitEvent[]> = {};
  for (const symbol of symbols) {
    let chart;
    try {
      chart = await yahooFinance.chart(symbol, {
        period1: 0,
        interval: "1d",
        events: "split",
      });
    } catch (error) {
      throw new Error(`${symbol}: ${error instanceof Error ? error.message : String(error)}`);
    }
    const splits = (chart.events?.splits ?? []).filter(
      (split) => split.numerator <= MaxShareSplitTerm && split.denominator <= MaxShareSplitTerm,
    );
    if (splits.length > 0) {
      result[symbol] = splits.map((s) => ({
        date: s.date.toISOString().slice(0, 10),
        ratio: s.numerator / s.denominator,
      }));
    }
  }
  return result;
}
