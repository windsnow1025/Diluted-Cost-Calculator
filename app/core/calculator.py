from dataclasses import dataclass

from app.core.models import SymbolCost, Transaction, TransactionType


@dataclass
class _Accumulator:
    shares: float = 0.0
    net_cost: float = 0.0


def calculate_costs(transactions: list[Transaction]) -> list[SymbolCost]:
    symbols: dict[str, _Accumulator] = {}

    for tx in transactions:
        if tx.symbol not in symbols:
            symbols[tx.symbol] = _Accumulator()

        acc = symbols[tx.symbol]

        if tx.type == TransactionType.Trades:
            acc.shares += tx.quantity

        acc.net_cost += tx.net_amount

    results: list[SymbolCost] = []
    for symbol in sorted(symbols):
        acc = symbols[symbol]
        cost_per_share = acc.net_cost / acc.shares if acc.shares != 0 else None
        results.append(SymbolCost(
            symbol=symbol,
            shares=acc.shares,
            net_cost=round(acc.net_cost, 2),
            cost_per_share=round(cost_per_share, 2) if cost_per_share is not None else None,
        ))

    return results
