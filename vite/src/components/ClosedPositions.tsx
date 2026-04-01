import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {closedPositions} from "../lib/portfolio/PortfolioService";
import {fmtDollar, pnlColor} from "../lib/format";
import SymbolCell from "./SymbolCell";

function ClosedPositions() {
  const positions = closedPositions;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" sx={{mb: 2}}>Closed Positions ({positions.length})</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell align="right">Realized P&L</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {positions.map((p) => (
                <TableRow key={p.symbol} hover>
                  <SymbolCell symbol={p.symbol} />
                  <TableCell align="right" sx={{color: pnlColor(p.realizedPnl)}}>
                    {fmtDollar(p.realizedPnl)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

export default ClosedPositions;
