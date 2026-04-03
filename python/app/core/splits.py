from datetime import datetime

import pandas as pd
import yfinance as yf

from app.core.models import Transaction, TransactionType


def adjust_for_splits(transactions: list[Transaction]) -> list[Transaction]:
    symbols = {tx.symbol for tx in transactions if tx.type == TransactionType.Trades}

    split_data: dict[str, pd.Series] = {}
    for symbol in symbols:
        ticker = yf.Ticker(symbol)
        splits = ticker.splits
        if not splits.empty:
            split_data[symbol] = splits

    adjusted: list[Transaction] = []
    for tx in transactions:
        if tx.type != TransactionType.Trades or tx.symbol not in split_data:
            adjusted.append(tx)
            continue

        if isinstance(tx.date, datetime):
            tx_date = tx.date
            date_str = tx.date.strftime("%Y-%m-%d")
        else:
            tx_date = datetime.strptime(tx.date, "%Y-%m-%d")
            date_str = tx.date
        splits = split_data[tx.symbol]

        multiplier = 1.0
        for split_date, ratio in splits.items():
            assert isinstance(split_date, pd.Timestamp)
            if split_date.to_pydatetime().replace(tzinfo=None) > tx_date:
                multiplier *= ratio

        adjusted.append(Transaction(
            date=date_str,
            platform=tx.platform,
            type=tx.type,
            symbol=tx.symbol,
            quantity=tx.quantity * multiplier if tx.quantity is not None else None,
            price=tx.price / multiplier if tx.price is not None else None,
            amount=tx.amount,
            fees=tx.fees,
            tax_withholding=tx.tax_withholding,
            net_amount=tx.net_amount,
        ))

    return adjusted
