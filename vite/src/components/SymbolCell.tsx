import TableCell from "@mui/material/TableCell";

function SymbolCell({symbol, onClick}: {symbol: string; onClick: (symbol: string) => void}) {
  return (
    <TableCell
      sx={{fontWeight: 600, cursor: "pointer"}}
      onClick={() => onClick(symbol)}
    >
      <div className="flex-start-center-nowrap gap-2">
        <img
          src={`https://financialmodelingprep.com/image-stock/${symbol}.png`}
          width={20}
          height={20}
          alt={symbol}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        {symbol}
      </div>
    </TableCell>
  );
}

export default SymbolCell;
