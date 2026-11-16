import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {platformSummaries} from "../../lib/portfolio/PortfolioService.ts";
import {fmtDollar, fmtPct, pnlColor} from "../../lib/utils/format.ts";

function PlatformSummaries() {
  return (
    <Card variant="outlined" sx={{transition: "border-color 0.2s", "&:hover": {borderColor: "text.primary"}}}>
      <CardContent>
        <Typography variant="h6" className="mb-2">
          Platforms ({platformSummaries.length})
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Platform</TableCell>
                <TableCell align="right">Total P&L</TableCell>
                <TableCell align="right">Unrealized P&L</TableCell>
                <TableCell align="right">Realized P&L</TableCell>
                <TableCell align="right">Total %</TableCell>
                <TableCell align="right">CAGR</TableCell>
                <TableCell align="right">Avg Daily Assets</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {platformSummaries.map(({platform, summary: s}) => (
                <TableRow key={platform} hover>
                  <TableCell>{platform}</TableCell>
                  <TableCell align="right" sx={{color: pnlColor(s.totalPnl)}}>
                    {fmtDollar(s.totalPnl)}
                  </TableCell>
                  <TableCell align="right" sx={{color: pnlColor(s.unrealizedPnl)}}>
                    {fmtDollar(s.unrealizedPnl)}
                  </TableCell>
                  <TableCell align="right" sx={{color: pnlColor(s.realizedPnl)}}>
                    {fmtDollar(s.realizedPnl)}
                  </TableCell>
                  <TableCell align="right" sx={{color: pnlColor(s.totalPnlPct)}}>
                    {fmtPct(s.totalPnlPct)}
                  </TableCell>
                  <TableCell align="right" sx={{color: pnlColor(s.cagrPct)}}>
                    {fmtPct(s.cagrPct)}
                  </TableCell>
                  <TableCell align="right">{fmtDollar(s.avgDailyAssets)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

export default PlatformSummaries;
