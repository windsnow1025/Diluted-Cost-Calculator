import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {priceHistoryMap, transactions} from "../lib/portfolio/PortfolioService";
import PriceChart from "./PriceChart";

function SymbolChartDialog({symbol, onClose}: {symbol: string | null; onClose: () => void}) {
  const open = symbol !== null;
  const history = symbol ? priceHistoryMap[symbol] ?? [] : [];
  const symbolTx = symbol ? transactions.filter((tx) => tx.symbol === symbol) : [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false}
      slotProps={{paper: {sx: {width: "80vw", height: "80vh"}}}}
    >
      <DialogTitle className="flex-between-nowrap">
        {symbol}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{display: "flex", flexDirection: "column"}}>
        {history.length > 0 ? (
          <PriceChart priceHistory={history} transactions={symbolTx} />
        ) : (
          "No price history available."
        )}
      </DialogContent>
    </Dialog>
  );
}

export default SymbolChartDialog;
