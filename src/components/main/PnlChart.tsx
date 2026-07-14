import {useEffect, useRef, useState} from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import {BaselineSeries, ColorType, createChart, type Time} from "lightweight-charts";
import {useColorScheme, useTheme} from "@mui/material/styles";
import {dailyPnlSeries} from "../../lib/portfolio/PortfolioService.ts";

type PnlUnit = "$" | "%";

function PnlChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [unit, setUnit] = useState<PnlUnit>("$");
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
      priceFormat: {type: unit === "$" ? "price" : "percent"},
    });

    baselineSeries.setData(
      dailyPnlSeries.map((p) => {
        const value = unit === "$" ? p.pnl : p.pnlPct;
        return value !== null ? {time: p.date as Time, value} : {time: p.date as Time};
      }),
    );

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [unit, isDark, theme]);

  return (
    <Card variant="outlined">
      <CardContent>
        <div className="flex-between-nowrap mb-2">
          <Typography variant="h6">P&L History</Typography>
          <ToggleButtonGroup
            value={unit}
            exclusive
            size="small"
            onChange={(_, next: PnlUnit | null) => {
              if (next !== null) setUnit(next);
            }}
          >
            <ToggleButton value="$">$</ToggleButton>
            <ToggleButton value="%">%</ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div ref={containerRef} className="h-80"/>
      </CardContent>
    </Card>
  );
}

export default PnlChart;
