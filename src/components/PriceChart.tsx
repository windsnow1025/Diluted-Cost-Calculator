import {useEffect, useRef} from "react";
import {
  ColorType,
  createChart,
  createSeriesMarkers,
  type IChartApi,
  LineSeries,
  type SeriesMarker,
  type Time
} from "lightweight-charts";
import {useColorScheme, useTheme} from "@mui/material/styles";
import {type Transaction, TransactionType} from "../lib/portfolio/Portfolio";
import type {PricePoint} from "../lib/prices/PriceClient";

function PriceChart({priceHistory, transactions}: {priceHistory: PricePoint[]; transactions: Transaction[]}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const theme = useTheme();
  const {mode, systemMode} = useColorScheme();
  const isDark = (mode === "system" ? systemMode : mode) === "dark";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const palette = theme.palette;
    const chart = createChart(container, {
      autoSize: true,
      layout: {
        background: {type: ColorType.Solid, color: "transparent"},
        textColor: palette.text.primary,
      },
      grid: {
        vertLines: {color: palette.divider},
        horzLines: {color: palette.divider},
      },
      rightPriceScale: {autoScale: true, mode: 1, scaleMargins: {top: 0.1, bottom: 0}},
      timeScale: {timeVisible: false},
    });
    chartRef.current = chart;

    const lineSeries = chart.addSeries(LineSeries, {
      color: palette.primary.main,
      lineWidth: 1,
    });

    lineSeries.setData(
      priceHistory.map((p) => ({time: p.date as Time, value: p.close})),
    );

    const markers: SeriesMarker<Time>[] = transactions
      .filter((tx) => tx.type === TransactionType.Trades && tx.quantity !== null)
      .map((tx) => {
        const isBuy = tx.quantity! > 0;
        return {
          time: tx.date.split(" ")[0] as Time,
          position: isBuy ? "belowBar" as const : "aboveBar" as const,
          color: isBuy ? palette.success.main : palette.error.main,
          shape: isBuy ? "arrowUp" as const : "arrowDown" as const,
          text: isBuy ? "B" : "S",
        };
      })
      .sort((a, b) => (a.time < b.time ? -1 : a.time > b.time ? 1 : 0));

    createSeriesMarkers(lineSeries, markers);
    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [priceHistory, transactions, isDark, theme]);

  return <div ref={containerRef} className="inflex-fill" />;
}

export default PriceChart;
