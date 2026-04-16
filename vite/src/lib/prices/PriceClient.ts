import YahooFinance from "yahoo-finance2";
import type {PricePoint} from "../portfolio/Portfolio";

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

export async function fetchPrices(symbols: string[]): Promise<Record<string, number>> {
  const quotes = await yahooFinance.quote(symbols);
  const prices: Record<string, number> = {};
  for (const quote of quotes) {
    if (quote.regularMarketPrice !== undefined) {
      prices[quote.symbol] = quote.regularMarketPrice;
    }
  }
  return prices;
}

export async function fetchPriceHistory(
  symbols: string[],
): Promise<Record<string, PricePoint[]>> {
  const history: Record<string, PricePoint[]> = {};
  for (const symbol of symbols) {
    const result = await yahooFinance.chart(symbol, {period1: 0, interval: "1d"});
    history[symbol] = result.quotes
      .filter((q) => q.close !== null)
      .map((q) => ({
        date: q.date.toISOString().slice(0, 10),
        close: +q.close!.toFixed(2),
      }));
  }
  return history;
}
