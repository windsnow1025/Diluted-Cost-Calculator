import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {useColorScheme} from "@mui/material/styles";
import ContrastIcon from "@mui/icons-material/Contrast";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const ThemeCycle = ["system", "dark", "light"] as const;

function ThemeSwitch() {
  const {mode, setMode} = useColorScheme();

  const nextMode = () => {
    const currentIndex = ThemeCycle.indexOf(mode ?? "system");
    const next = ThemeCycle[(currentIndex + 1) % ThemeCycle.length];
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

export default ThemeSwitch;
