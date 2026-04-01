import csv
import json
from dataclasses import asdict, is_dataclass
from pathlib import Path
from typing import Any

from app.core.models import SymbolDilutedCost

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


def _serialize(data: Any) -> Any:
    if is_dataclass(data):
        return {_to_camel_case(k): _serialize(v) for k, v in asdict(data).items()}
    if isinstance(data, list):
        return [_serialize(item) for item in data]
    if isinstance(data, dict):
        return {k: _serialize(v) for k, v in data.items()}
    return data


def write_json(data: Any, file_path: Path) -> None:
    file_path.parent.mkdir(parents=True, exist_ok=True)
    with open(file_path, "w") as f:
        json.dump(_serialize(data), f, indent=2, default=str)
