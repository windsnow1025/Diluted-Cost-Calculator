import {afterAll, beforeAll, describe, expect, it, vi} from "vitest";
import {computeAvgDailyMarketValue, computeCAGR, computeDailyPnlSeries} from "./PortfolioStats";
import {TransactionType, type Transaction} from "./Portfolio";

describe("PortfolioStats", () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2020-01-03T00:00:00Z"));
  });
  afterAll(() => vi.useRealTimers());

  it("computeAvgDailyMarketValue", () => {
    const trades: Transaction[] = [{
      date: "2020-01-01", platform: "X", type: TransactionType.Trades, symbol: "A",
      quantity: 1, price: 100, amount: 100, fees: 0, taxWithholding: 0, netAmount: 100,
    }];
    const priceHistory = {
      A: [
        {date: "2020-01-01", close: 100},
        {date: "2020-01-02", close: 110},
        {date: "2020-01-03", close: 120},
      ],
    };
    // avg = (100 + 110 + 120) / 3 = 110
    const {avgDailyAssets, totalDays} = computeAvgDailyMarketValue(trades, priceHistory);
    expect(totalDays).toBe(3);
    expect(avgDailyAssets).toBe(110);
  });

  it("computeCAGR", () => {
    // ((1 + 1) ^ (365/365) - 1) * 100 = 100
    expect(computeCAGR(1, 365)).toBe(100);
  });

  it("computeDailyPnlSeries", () => {
    vi.setSystemTime(new Date("2020-01-05T00:00:00Z"));
    const transactions: Transaction[] = [{
      date: "2020-01-01", platform: "X", type: TransactionType.Trades, symbol: "A",
      quantity: 2, price: 100, amount: 200, fees: 0, taxWithholding: 0, netAmount: 200,
    }, {
      date: "2020-01-03", platform: "X", type: TransactionType.Dividends, symbol: "A",
      amount: -10, fees: 0, taxWithholding: 0, netAmount: -10,
    }, {
      date: "2020-01-04", platform: "X", type: TransactionType.Trades, symbol: "A",
      quantity: -1, price: 120, amount: -120, fees: 0, taxWithholding: 0, netAmount: -120,
    }];
    const priceHistory = {
      A: [
        {date: "2020-01-01", close: 100},
        {date: "2020-01-03", close: 110},
        {date: "2020-01-04", close: 120},
      ],
    };
    // mktValue = [200, 200, 220, 120, 120]
    // netDilutedCost = [200, 200, 190, 70, 70]
    const series = computeDailyPnlSeries(transactions, priceHistory);
    expect(series.map((p) => p.pnl)).toEqual([0, 0, 30, 50, 50]);
    expect(series[4]).toEqual({date: "2020-01-05", mktValue: 120, netDilutedCost: 70, pnl: 50});
  });
});
