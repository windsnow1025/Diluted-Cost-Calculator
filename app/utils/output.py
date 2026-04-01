import csv
from pathlib import Path

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
