import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import icon from "assets/images/icon-logo.png";
import darkLogo from "assets/images/logo-text-white.svg";
import lightLogo from "assets/images/logo-text-black.svg";
// import santaHat from "assets/images/christmas-hat-png-19601.png";
// ----------------------------------------------------------------------

export default function Logo({ sx, isCollapse = true, isShowDecoration = false }: any) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "fit-content",
        height: "50px",
        position: "relative",
        margin: "0 auto",
        ...sx,
      }}
    >
      <img
        src={isCollapse ? icon : theme.palette.mode === "light" ? lightLogo : darkLogo}
        alt="logo"
        style={{
          height: "100%",
          width: "100%",
          objectFit: "contain",
          objectPosition: "center",
        }}
      />
    </Box>
  );
}
