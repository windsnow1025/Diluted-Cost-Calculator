# Diluted Cost Calculator

Portfolio diluted cost calculator with web dashboard. Reads trading history from Excel, calculates diluted cost basis
per symbol, and displays results with interactive price charts.

## Input Data Format

The input file `Trading History.xlsx` must have the following columns in the first row:

| Column          | Type            | Description                                                               |
|-----------------|-----------------|---------------------------------------------------------------------------|
| Date            | date            | Transaction date                                                          |
| Platform        | string          | Trading platform                                                          |
| Type            | string          | `Trades` or `Dividends`                                                   |
| Symbol          | string          | Ticker symbol (e.g., `GOOGL`)                                             |
| Quantity        | number or empty | Share quantity (positive for buy, negative for sell; empty for dividends) |
| Price           | number or empty | Price per share (empty for dividends)                                     |
| Amount          | number          | Total amount                                                              |
| Fees & Comm     | number          | Fees and commissions                                                      |
| Tax Withholding | number          | Tax withheld                                                              |
| Net Amount      | number          | Net amount after fees and tax                                             |

Stock splits are automatically adjusted.

## Setup

### Environment Variables

Copy `python/.env.example` to `python/.env` and set:

```
DATA_DIR=<path to directory containing Trading History.xlsx>
```

### Run

```bash
# Generate data
cd python
uv run --module app.main
```

```bash
# Start web dashboard
cd vite
pnpm install
pnpm dev
```
