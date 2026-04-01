from pathlib import Path

DataDir = Path(__file__).resolve().parent.parent / "data"
OutputDir = Path(__file__).resolve().parent.parent / "output"
InputFile = DataDir / "Trading History.xlsx"
OutputFile = OutputDir / "Portfolio Cost.csv"
