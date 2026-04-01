from app.config import InputFile, OutputFile
from app.core.calculator import calculate_costs
from app.utils.input import read_transactions
from app.utils.output import write_output


def main() -> None:
    transactions = read_transactions(InputFile)
    results = calculate_costs(transactions)
    write_output(results, OutputFile)


if __name__ == "__main__":
    main()
