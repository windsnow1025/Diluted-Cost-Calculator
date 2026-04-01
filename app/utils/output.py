import csv
import json
from pathlib import Path

import yfinance as yf

from app.core.models import SymbolCost

Headers = ["Symbol", "Shares", "Net Cost", "Cost Per Share"]


def write_output(results: list[SymbolCost], file_path: Path) -> None:
    with open(file_path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(Headers)
        for result in results:
            writer.writerow([
                result.symbol,
                result.shares,
                result.net_cost,
                result.cost_per_share if result.cost_per_share is not None else "",
            ])


def write_prices(results: list[SymbolCost], file_path: Path) -> None:
    symbols = [r.symbol for r in results if r.shares > 0]
    tickers = yf.Tickers(" ".join(symbols))
    prices: dict[str, float] = {}
    for symbol in symbols:
        info = tickers.tickers[symbol].info
        price = info.get("regularMarketPrice") or info.get("currentPrice")
        if price is not None:
            prices[symbol] = price

    with open(file_path, "w") as f:
        json.dump(prices, f, indent=2)
