import {writeFileSync} from "node:fs";
import {resolve} from "node:path";
import transactionsData from "../src/data/transactions_raw.json";
import {calculateDilutedCosts} from "../src/lib/portfolio/Calculator";
import type {Transaction} from "../src/lib/portfolio/Portfolio";
import {sortTransactions} from "../src/lib/portfolio/TransactionSort";
import {fetchPrices, fetchPriceHistory} from "../src/lib/prices/PriceClient";
import {adjustForSplits} from "../src/lib/splits/Adjuster";
import {fetchSplits} from "../src/lib/splits/SplitsClient";

const DataDir = resolve(import.meta.dirname, "../src/data");
const RawTransactionsFile = resolve(DataDir, "transactions_raw.json");
const TransactionsFile = resolve(DataDir, "transactions.json");
const DilutedCostFile = resolve(DataDir, "diluted_cost.json");
const PricesFile = resolve(DataDir, "prices.json");
const PriceHistoryFile = resolve(DataDir, "price_history.json");
const MetadataFile = resolve(DataDir, "metadata.json");

async function main(): Promise<void> {
  const rawTransactions = sortTransactions(transactionsData as Transaction[]);
  writeFileSync(RawTransactionsFile, JSON.stringify(rawTransactions, null, 2));
  const allSymbols = [...new Set(rawTransactions.map((tx) => tx.symbol))];

  const splitsBySymbol = await fetchSplits(allSymbols);
  const transactions = adjustForSplits(rawTransactions, splitsBySymbol);
  writeFileSync(TransactionsFile, JSON.stringify(transactions, null, 2));

  const rows = calculateDilutedCosts(transactions);
  writeFileSync(DilutedCostFile, JSON.stringify(rows, null, 2));

  const activeSymbols = rows.filter((r) => r.shares > 0).map((r) => r.symbol);

  const prices = await fetchPrices(activeSymbols);
  const priceHistory = await fetchPriceHistory(allSymbols);

  writeFileSync(PricesFile, JSON.stringify(prices, null, 2));
  writeFileSync(PriceHistoryFile, JSON.stringify(priceHistory, null, 2));
  writeFileSync(MetadataFile, JSON.stringify({generatedAt: new Date().toISOString()}, null, 2));
}

await main();
