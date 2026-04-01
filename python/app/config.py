from pathlib import Path

ProjectRoot = Path(__file__).resolve().parent.parent
DataDir = ProjectRoot / "data"
OutputDir = ProjectRoot.parent / "vite" / "src" / "data"
InputFile = DataDir / "Trading History.xlsx"
OutputFile = OutputDir / "Portfolio Diluted Cost.csv"
PricesFile = OutputDir / "prices.json"
