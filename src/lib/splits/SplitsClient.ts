import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export interface SplitEvent {
  date: string;
  ratio: number;
}

export async function fetchSplits(symbols: string[]): Promise<Record<string, SplitEvent[]>> {
  const result: Record<string, SplitEvent[]> = {};
  for (const symbol of symbols) {
    const chart = await yahooFinance.chart(symbol, {
      period1: 0,
      interval: "1d",
      events: "split",
    });
    const splits = chart.events?.splits ?? [];
    if (splits.length > 0) {
      result[symbol] = splits.map((s) => ({
        date: s.date.toISOString().slice(0, 10),
        ratio: s.numerator / s.denominator,
      }));
    }
  }
  return result;
}
