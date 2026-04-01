from dataclasses import dataclass

from app.core.models import SymbolDilutedCost, Transaction, TransactionType


@dataclass
class _Accumulator:
    shares: float = 0.0
    net_diluted_cost: float = 0.0


def calculate_diluted_costs(transactions: list[Transaction]) -> list[SymbolDilutedCost]:
    symbols: dict[str, _Accumulator] = {}

    for tx in transactions:
        if tx.symbol not in symbols:
            symbols[tx.symbol] = _Accumulator()

        acc = symbols[tx.symbol]

        if tx.type == TransactionType.Trades:
            acc.shares += tx.quantity

        acc.net_diluted_cost += tx.net_amount

    results: list[SymbolDilutedCost] = []
    for symbol in sorted(symbols):
        acc = symbols[symbol]
        diluted_cost_per_share = acc.net_diluted_cost / acc.shares if acc.shares != 0 else None
        results.append(SymbolDilutedCost(
            symbol=symbol,
            shares=acc.shares,
            net_diluted_cost=round(acc.net_diluted_cost, 2),
            diluted_cost_per_share=round(diluted_cost_per_share, 2) if diluted_cost_per_share is not None else None,
        ))

    return results
