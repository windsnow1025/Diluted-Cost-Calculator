import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {summary} from "../../lib/portfolio/PortfolioService.ts";
import {fmtDollar, fmtPct, pnlColor} from "../../lib/utils/format.ts";

const hoverSx = {transition: "border-color 0.2s", "&:hover": {borderColor: "text.primary"}};

function SummaryCards() {
  const s = summary;

  return (
    <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
      <Card variant="outlined" sx={hoverSx}>
        <CardContent>
          <Typography variant="caption" color="text.secondary" sx={{textTransform: "uppercase", letterSpacing: 0.5}}>
            Positions
          </Typography>
          <Typography variant="h5" sx={{fontWeight: 700}}>
            {s.activeCount} active · {s.closedCount} closed
          </Typography>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={hoverSx}>
        <CardContent>
          <Typography variant="caption" color="text.secondary" sx={{textTransform: "uppercase", letterSpacing: 0.5}}>
            Market Value
          </Typography>
          <Typography variant="h5" sx={{fontWeight: 700}}>
            {fmtDollar(s.totalMktValue)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cost: {fmtDollar(s.totalDilutedCost)}
          </Typography>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={hoverSx}>
        <CardContent>
          <Typography variant="caption" color="text.secondary" sx={{textTransform: "uppercase", letterSpacing: 0.5}}>
            Total P&L
          </Typography>
          <Typography variant="h5" sx={{fontWeight: 700, color: pnlColor(s.totalPnl)}}>
            {fmtDollar(s.totalPnl)}
          </Typography>
          <Typography variant="body2" sx={{color: pnlColor(s.totalPnlPct)}}>
            {fmtPct(s.totalPnlPct)}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default SummaryCards;
