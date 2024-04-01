// Components
import { useTheme, styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1, 0, 3),
  height: "100%",
  width: "100%",
}));

// ----------------------------------------------------------------------

type ListToolbarProps = {
  numSelected?: number;
  renderContent?: any;
};

const ListToolbar = ({ numSelected = 0, renderContent }: ListToolbarProps) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: isLight ? "primary.main" : "text.primary",
          bgcolor: isLight ? "primary.lighter" : "primary.dark",
        }),
      }}
    >
      {renderContent ? renderContent() : null}
    </RootStyle>
  );
};

export default ListToolbar;
