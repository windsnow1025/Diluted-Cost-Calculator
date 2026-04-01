import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import {useColorScheme} from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ContrastIcon from "@mui/icons-material/Contrast";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SummaryCards from "./components/SummaryCards";
import ActiveHoldings from "./components/ActiveHoldings";
import ClosedPositions from "./components/ClosedPositions";

const themeCycle = ["system", "dark", "light"] as const;

function ThemeSwitch() {
  const {mode, setMode} = useColorScheme();

  const nextMode = () => {
    const currentIndex = themeCycle.indexOf(mode ?? "system");
    const next = themeCycle[(currentIndex + 1) % themeCycle.length];
    setMode(next);
  };

  const icon = mode === "dark"
    ? <DarkModeIcon/>
    : mode === "light"
      ? <LightModeIcon/>
      : <ContrastIcon/>;

  const label = mode === "dark"
    ? "Dark"
    : mode === "light"
      ? "Light"
      : "System";

  return (
    <Tooltip title={`Theme: ${label}`}>
      <IconButton
        onClick={nextMode}
        sx={{position: "fixed", top: 16, right: 16, zIndex: 1}}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
}

function App() {
  return (
    <Container maxWidth="lg">
      <ThemeSwitch/>
      <div className="flex-column gap-4 py-6">
        <Typography variant="h4" component="h1" sx={{fontWeight: 700}}>
          Portfolio Diluted Cost
        </Typography>
        <SummaryCards/>
        <ActiveHoldings/>
        <ClosedPositions/>
      </div>
    </Container>
  );
}

export default App;
