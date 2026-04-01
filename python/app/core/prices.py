import yfinance as yf

from app.core.models import SymbolDilutedCost


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
