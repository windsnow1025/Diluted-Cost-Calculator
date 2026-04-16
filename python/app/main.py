from app.config import InputFile, TransactionsRawFile
from app.utils.input import read_transactions
from app.utils.output import write_json


def main() -> None:
    transactions = read_transactions(InputFile)
    write_json(transactions, TransactionsRawFile)


if __name__ == "__main__":
    main()
