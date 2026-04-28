import {useState} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import {activeHoldings, summary} from "../../lib/portfolio/PortfolioService.ts";
import {fmtDollar, fmtPct, pnlColor} from "../../lib/utils/format.ts";
import SymbolCell from "./SymbolCell.tsx";
import SymbolChartDialog from "./SymbolChartDialog.tsx";

function ActiveHoldings() {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  return (
    <Card variant="outlined">
      <CardContent>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-2">
          <Typography variant="h6">Active Holdings ({activeHoldings.length})</Typography>
          <div className="flex flex-wrap items-baseline justify-end gap-x-4 gap-y-1">
            <Typography variant="body2" color="text.secondary">
              Market Value: {fmtDollar(summary.totalMktValue)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cost: {fmtDollar(summary.totalDilutedCost)}
            </Typography>
            <Typography variant="subtitle1" sx={{fontWeight: 600, color: pnlColor(summary.unrealizedPnl)}}>
              {fmtDollar(summary.unrealizedPnl)}
            </Typography>
          </div>
        </div>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell align="right">Shares</TableCell>
                <TableCell align="right">P&L %</TableCell>
                <TableCell align="right">P&L</TableCell>
                <TableCell align="right">Cost/Share</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Weight</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activeHoldings.map((h) => (
                <TableRow key={h.symbol} hover>
                  <SymbolCell symbol={h.symbol} onClick={setSelectedSymbol} />
                  <TableCell align="right">{h.shares}</TableCell>
                  <TableCell align="right" sx={{color: pnlColor(h.pnlPct)}}>
                    {fmtPct(h.pnlPct)}
                  </TableCell>
                  <TableCell align="right" sx={{color: pnlColor(h.pnl)}}>
                    {fmtDollar(h.pnl)}
                  </TableCell>
                  <TableCell align="right">
                    {h.dilutedCostPerShare != null ? fmtDollar(h.dilutedCostPerShare) : "-"}
                  </TableCell>
                  <TableCell align="right" sx={{color: pnlColor(h.pnl)}}>
                    {fmtDollar(h.price)}
                  </TableCell>
                  <TableCell align="right" sx={{minWidth: 140}}>
                    <div className="flex items-center justify-end gap-2">
                      <Typography variant="body2">
                        {h.weight.toFixed(1)}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={h.weight}
                        sx={{width: 100, height: 6, borderRadius: 3}}
                      />
                    </div>
                    <Typography variant="caption" color="text.secondary">
                      {fmtDollar(h.mktValue)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      <SymbolChartDialog symbol={selectedSymbol} onClose={() => setSelectedSymbol(null)} />
    </Card>
  );
}

export default ActiveHoldings;
