import csv
import json
from dataclasses import asdict
from pathlib import Path

import yfinance as yf

from app.core.models import SymbolDilutedCost, Transaction

Headers = ["Symbol", "Shares", "Net Diluted Cost", "Diluted Cost Per Share"]


def write_output(results: list[SymbolDilutedCost], file_path: Path) -> None:
    file_path.parent.mkdir(parents=True, exist_ok=True)
    with open(file_path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(Headers)
        for result in results:
            writer.writerow([
                result.symbol,
                result.shares,
                result.net_diluted_cost,
                result.diluted_cost_per_share if result.diluted_cost_per_share is not None else "",
            ])


def write_transactions(transactions: list[Transaction], file_path: Path) -> None:
    file_path.parent.mkdir(parents=True, exist_ok=True)
    with open(file_path, "w") as f:
        json.dump([asdict(tx) for tx in transactions], f, indent=2, default=str)


def write_prices(results: list[SymbolDilutedCost], file_path: Path) -> None:
    symbols = [r.symbol for r in results if r.shares > 0]
    tickers = yf.Tickers(" ".join(symbols))
    prices: dict[str, float] = {}
    for symbol in symbols:
        info = tickers.tickers[symbol].info
        price = info.get("regularMarketPrice") or info.get("currentPrice")
        if price is not None:
            prices[symbol] = price

    file_path.parent.mkdir(parents=True, exist_ok=True)
    with open(file_path, "w") as f:
        json.dump(prices, f, indent=2)
