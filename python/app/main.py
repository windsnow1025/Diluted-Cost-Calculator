from app.config import DilutedCostFile, InputFile, OutputFile, PricesFile, TransactionsFile
from app.core.calculator import calculate_diluted_costs
from app.core.prices import fetch_prices
from app.utils.input import read_transactions
from app.utils.output import write_csv, write_diluted_cost, write_prices, write_transactions


def main() -> None:
    transactions = read_transactions(InputFile)
    results = calculate_diluted_costs(transactions)
    prices = fetch_prices(results)
    write_csv(results, OutputFile)
    write_diluted_cost(results, DilutedCostFile)
    write_transactions(transactions, TransactionsFile)
    write_prices(prices, PricesFile)


if __name__ == "__main__":
    main()
