from app.config import (
    DilutedCostFile,
    InputFile,
    OutputFile,
    TransactionsFile,
)
from app.core.calculator import calculate_diluted_costs
from app.core.splits import adjust_for_splits
from app.utils.input import read_transactions
from app.utils.output import write_csv, write_json


def main() -> None:
    transactions = read_transactions(InputFile)
    transactions = adjust_for_splits(transactions)
    results = calculate_diluted_costs(transactions)
    write_csv(results, OutputFile)
    write_json(results, DilutedCostFile)
    write_json(transactions, TransactionsFile)


if __name__ == "__main__":
    main()
