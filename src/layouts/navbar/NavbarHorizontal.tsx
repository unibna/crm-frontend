import { memo } from "react";
import { useLocation } from "react-router-dom";

// @mui
import { styled } from "@mui/material/styles";
import { Container } from "@mui/material";
import useSettings from "hooks/useSettings";

// config
import { HEADER } from "constants/index";
// components
import sidebarConfig from "layouts/navbar/SidebarConfig";
import useAuth from "hooks/useAuth";
import { NavSectionHorizontal } from "components/Sections";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  transition: theme.transitions.create("top", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  width: "100%",
  position: "fixed",
  zIndex: theme.zIndex.appBar,
  padding: theme.spacing(1, 0),
  boxShadow: theme.customShadows.z8,
  top: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT + 20,
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

function NavbarHorizontal() {
  const { pathname } = useLocation();
  const { isOpenModal, onShowModal } = useSettings();
  const { user } = useAuth();

  return (
    <RootStyle>
      <Container maxWidth={false}>
        <NavSectionHorizontal
          navConfig={sidebarConfig({
            roles: user?.group_permission?.data,
            userGroupId: user?.group_permission?.id || "",
            pathname,
            handleShowThemeModal: () => onShowModal(!isOpenModal),
          })}
        />
      </Container>
    </RootStyle>
  );
}

export default memo(NavbarHorizontal);
