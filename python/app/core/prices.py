import pandas as pd
import yfinance as yf

from app.core.models import SymbolDilutedCost, Transaction


def fetch_prices(results: list[SymbolDilutedCost]) -> dict[str, float]:
    symbols = [r.symbol for r in results if r.shares > 0]
    tickers = yf.Tickers(" ".join(symbols))
    prices: dict[str, float] = {}
    for symbol in symbols:
        info = tickers.tickers[symbol].info
        price = info.get("regularMarketPrice") or info.get("currentPrice")
        if price is not None:
            prices[symbol] = price
    return prices


def fetch_price_history(
    transactions: list[Transaction],
) -> dict[str, list[dict[str, str | float]]]:
    symbols = {tx.symbol for tx in transactions}

    history: dict[str, list[dict[str, str | float]]] = {}
    for symbol in symbols:
        ticker = yf.Ticker(symbol)
        df = ticker.history(period="max")
        rows: list[dict[str, str | float]] = []
        for ts, row in df.iterrows():
            assert isinstance(ts, pd.Timestamp)
            rows.append({"date": ts.strftime("%Y-%m-%d"), "close": round(row["Close"], 2)})
        history[symbol] = rows

    return history
