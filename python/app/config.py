import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

DataDir = Path(os.environ["DATA_DIR"])
InputFile = DataDir / "Trading History.xlsx"
OutputFile = DataDir / "Diluted Cost.csv"

ProjectRoot = Path(__file__).resolve().parent.parent
OutputDir = ProjectRoot.parent / "vite" / "src" / "data"
DilutedCostFile = OutputDir / "diluted_cost.json"
TransactionsFile = OutputDir / "transactions.json"
