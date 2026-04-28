import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {summary} from "../../lib/portfolio/PortfolioService.ts";
import {fmtDollar, fmtPct, pnlColor} from "../../lib/utils/format.ts";

const hoverSx = {transition: "border-color 0.2s", "&:hover": {borderColor: "text.primary"}};

function SummaryCards() {
  const s = summary;

  return (
    <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
      <Card variant="outlined" sx={hoverSx}>
        <CardContent>
          <Typography variant="caption" color="text.secondary" sx={{textTransform: "uppercase", letterSpacing: 0.5}}>
            Total P&L
          </Typography>
          <Typography variant="h5" sx={{fontWeight: 700, color: pnlColor(s.totalPnl)}}>
            {fmtDollar(s.totalPnl)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Unrealized P&L:{" "}
            <Box component="span" sx={{color: pnlColor(s.unrealizedPnl)}}>
              {fmtDollar(s.unrealizedPnl)}
            </Box>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Realized P&L:{" "}
            <Box component="span" sx={{color: pnlColor(s.realizedPnl)}}>
              {fmtDollar(s.realizedPnl)}
            </Box>
          </Typography>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={hoverSx}>
        <CardContent>
          <Typography variant="caption" color="text.secondary" sx={{textTransform: "uppercase", letterSpacing: 0.5}}>
            CAGR
          </Typography>
          <Typography variant="h5" sx={{fontWeight: 700, color: pnlColor(s.cagrPct)}}>
            {fmtPct(s.cagrPct)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total: {fmtPct(s.totalPnlPct)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Average Daily Assets: {fmtDollar(s.avgDailyAssets)}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default SummaryCards;
