from dataclasses import dataclass
from enum import StrEnum


class TransactionType(StrEnum):
    Trades = "Trades"
    Dividends = "Dividends"


@dataclass
class Transaction:
    date: str
    platform: str
    type: TransactionType
    symbol: str
    quantity: float | None
    trade_price: float | None
    amount: float
    fees: float
    tax_withholding: float
    net_amount: float


@dataclass
class SymbolCost:
    symbol: str
    shares: float
    net_cost: float
    cost_per_share: float | None
