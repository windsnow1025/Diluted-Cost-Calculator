import {useEffect, useRef} from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {BaselineSeries, ColorType, createChart, type Time} from "lightweight-charts";
import {useColorScheme, useTheme} from "@mui/material/styles";
import {dailyPnlSeries} from "../../lib/portfolio/PortfolioService.ts";

function PnlChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const {mode, systemMode} = useColorScheme();
  const isDark = (mode === "system" ? systemMode : mode) === "dark";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const palette = theme.colorSchemes[isDark ? "dark" : "light"]!.palette;
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
      rightPriceScale: {scaleMargins: {top: 0.1, bottom: 0.1}},
    });

    const baselineSeries = chart.addSeries(BaselineSeries, {
      baseValue: {type: "price", price: 0},
      topLineColor: palette.success.main,
      bottomLineColor: palette.error.main,
      lineWidth: 1,
    });

    baselineSeries.setData(
      dailyPnlSeries.map((p) => ({time: p.date as Time, value: p.pnl})),
    );

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [isDark, theme]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" className="mb-2">P&L History</Typography>
        <div ref={containerRef} className="h-80"/>
      </CardContent>
    </Card>
  );
}

export default PnlChart;
