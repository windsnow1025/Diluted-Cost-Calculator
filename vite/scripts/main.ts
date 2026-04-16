import {writeFileSync} from "node:fs";
import {resolve} from "node:path";
import dilutedCost from "../src/data/diluted_cost.json";
import {fetchPrices, fetchPriceHistory} from "../src/lib/prices/PriceClient";
import type {PortfolioRow} from "../src/lib/portfolio/Portfolio";

const DataDir = resolve(import.meta.dirname, "../src/data");
const PricesFile = resolve(DataDir, "prices.json");
const PriceHistoryFile = resolve(DataDir, "price_history.json");

async function main(): Promise<void> {
  const rows = dilutedCost as PortfolioRow[];
  const allSymbols = rows.map((r) => r.symbol);
  const activeSymbols = rows.filter((r) => r.shares > 0).map((r) => r.symbol);

  const prices = await fetchPrices(activeSymbols);
  const priceHistory = await fetchPriceHistory(allSymbols);

  writeFileSync(PricesFile, JSON.stringify(prices, null, 2));
  writeFileSync(PriceHistoryFile, JSON.stringify(priceHistory, null, 2));
}

await main();
