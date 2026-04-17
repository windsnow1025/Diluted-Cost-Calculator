import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import SummaryCards from "./components/main/SummaryCards.tsx";
import ActiveHoldings from "./components/main/ActiveHoldings.tsx";
import ClosedPositions from "./components/main/ClosedPositions.tsx";
import ThemeSwitch from "./components/common/ThemeSwitch.tsx";
import metadata from "./data/metadata.json";
import {fmtRelativeTime} from "./lib/utils/format";

function App() {
  return (
    <Container maxWidth="lg">
      <ThemeSwitch/>
      <div className="flex-column gap-4 py-6">
        <Typography variant="h4" component="h1" sx={{fontWeight: 700}}>
          Portfolio Diluted Cost
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          title={new Date(metadata.generatedAt).toLocaleString()}
        >
          Prices updated {fmtRelativeTime(metadata.generatedAt)}
        </Typography>
        <SummaryCards/>
        <ActiveHoldings/>
        <ClosedPositions/>
      </div>
    </Container>
  );
}

export default App;
