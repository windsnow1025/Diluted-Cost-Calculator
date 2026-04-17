import {afterAll, beforeAll, describe, expect, it, vi} from "vitest";
import {computeAvgDailyMarketValue, computeCAGR} from "./PortfolioStats";
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
});
