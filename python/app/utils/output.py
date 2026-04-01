import csv
import json
from dataclasses import asdict
from pathlib import Path
from typing import Any

from app.core.models import SymbolDilutedCost, Transaction

Headers = ["Symbol", "Shares", "Net Diluted Cost", "Diluted Cost Per Share"]


def write_csv(results: list[SymbolDilutedCost], file_path: Path) -> None:
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


def _to_camel_case(s: str) -> str:
    parts = s.split("_")
    return parts[0] + "".join(p.capitalize() for p in parts[1:])


def _camel_case_dict(d: dict) -> dict:
    return {_to_camel_case(k): v for k, v in d.items()}


def write_json(data: Any, file_path: Path) -> None:
    file_path.parent.mkdir(parents=True, exist_ok=True)
    with open(file_path, "w") as f:
        json.dump(data, f, indent=2, default=str)


def write_diluted_cost(results: list[SymbolDilutedCost], file_path: Path) -> None:
    write_json([_camel_case_dict(asdict(r)) for r in results], file_path)


def write_transactions(transactions: list[Transaction], file_path: Path) -> None:
    write_json([_camel_case_dict(asdict(tx)) for tx in transactions], file_path)


def write_prices(prices: dict[str, float], file_path: Path) -> None:
    write_json(prices, file_path)
