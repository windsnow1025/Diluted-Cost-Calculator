import {writeFileSync} from "node:fs";
import {resolve} from "node:path";
import transactionsData from "../src/data/transactions.json";
import {calculateDilutedCosts} from "../src/lib/portfolio/Calculator";
import type {Transaction} from "../src/lib/portfolio/Portfolio";
import {fetchPrices, fetchPriceHistory} from "../src/lib/prices/PriceClient";

const DataDir = resolve(import.meta.dirname, "../src/data");
const DilutedCostFile = resolve(DataDir, "diluted_cost.json");
const PricesFile = resolve(DataDir, "prices.json");
const PriceHistoryFile = resolve(DataDir, "price_history.json");

async function main(): Promise<void> {
  const transactions = transactionsData as Transaction[];
  const rows = calculateDilutedCosts(transactions);
  writeFileSync(DilutedCostFile, JSON.stringify(rows, null, 2));

  const allSymbols = rows.map((r) => r.symbol);
  const activeSymbols = rows.filter((r) => r.shares > 0).map((r) => r.symbol);

  const prices = await fetchPrices(activeSymbols);
  const priceHistory = await fetchPriceHistory(allSymbols);

  writeFileSync(PricesFile, JSON.stringify(prices, null, 2));
  writeFileSync(PriceHistoryFile, JSON.stringify(priceHistory, null, 2));
}

await main();
