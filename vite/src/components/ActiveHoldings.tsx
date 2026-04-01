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
import {activeHoldings} from "../lib/portfolio/PortfolioService";
import {fmtDollar, fmtPct, pnlColor} from "../lib/format";
import SymbolCell from "./SymbolCell";
import SymbolChartDialog from "./SymbolChartDialog";

function ActiveHoldings() {
  const holdings = activeHoldings;
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" sx={{mb: 2}}>Active Holdings</Typography>
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
              {holdings.map((h) => (
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
