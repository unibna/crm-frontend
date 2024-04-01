import { Icon } from "@iconify/react";
import menu2Fill from "@iconify/icons-eva/menu-2-fill";
// material
import { alpha, styled } from "@mui/material/styles";
import { AppBar, Toolbar, IconButton } from "@mui/material";
// hooks
//
import MHidden from "components/MHidden";
import { useAppSelector } from "hooks/reduxHook";
import { sidebarStore } from "store/redux/sidebar/slice";
import useSettings from "hooks/useSettings";

// ----------------------------------------------------------------------

export const DRAWER_WIDTH = 280;
export const COLLAPSE_WIDTH = 70;

export const SIDEBAR_WIDTH = `calc(100% - ${DRAWER_WIDTH + 1}px)`;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: "none",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up("lg")]: {
    width: SIDEBAR_WIDTH,
  },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: "48px !important",
  [theme.breakpoints.up("lg")]: {
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

type DashboardNavbarProps = {
  onOpenSidebar: VoidFunction;
};

export default function DashboardNavbar({ onOpenSidebar }: DashboardNavbarProps) {
  const {  themeLayout } = useSettings();
  const isCollapse = themeLayout === "vertical_collapsed";

  return (
    <MHidden width="lgUp">
      <RootStyle
        sx={{
          ...(isCollapse && {
            width: { lg: `calc(100% - ${COLLAPSE_WIDTH}px)` },
          }),
        }}
      >
        <ToolbarStyle>
          <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: "text.primary" }}>
            <Icon icon={menu2Fill} />
          </IconButton>
        </ToolbarStyle>
      </RootStyle>
    </MHidden>
  );
}
