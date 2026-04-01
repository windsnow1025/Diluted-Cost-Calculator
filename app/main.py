from app.config import InputFile, OutputFile, PricesFile
from app.core.calculator import calculate_diluted_costs
from app.utils.input import read_transactions
from app.utils.output import write_output, write_prices


def main() -> None:
    transactions = read_transactions(InputFile)
    results = calculate_diluted_costs(transactions)
    write_output(results, OutputFile)
    write_prices(results, PricesFile)


if __name__ == "__main__":
    main()
