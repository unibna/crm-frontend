import { useState, ReactNode } from "react";
import { Icon } from "@iconify/react";
import { NavLink as RouterLink, matchPath, useLocation, useNavigate } from "react-router-dom";
import arrowIosForwardFill from "@iconify/icons-eva/arrow-ios-forward-fill";
import arrowIosDownwardFill from "@iconify/icons-eva/arrow-ios-downward-fill";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import { alpha, useTheme, styled } from "@mui/material/styles";
import { ListItemButtonProps, BoxProps } from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import { THEME_TITLE } from "layouts/navbar/SidebarConfig";
import map from "lodash/map";

// ----------------------------------------------------------------------

const ListSubheaderStyle = styled((props) => (
  <ListSubheader disableSticky disableGutters {...props} />
))(({ theme }) => ({
  ...theme.typography.overline,
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  color: theme.palette.text.primary,
}));

interface ListItemStyleProps extends ListItemButtonProps {
  component?: ReactNode;
  to?: string;
}

const ListItemStyle = styled(ListItemButton)<ListItemStyleProps>(({ theme }) => ({
  ...theme.typography.body2,
  height: 48,
  position: "relative",
  textTransform: "capitalize",
  color: theme.palette.text.secondary,
  "&:before": {
    top: 0,
    right: 0,
    width: 3,
    bottom: 0,
    content: "''",
    display: "none",
    position: "absolute",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: theme.palette.primary.main,
  },
}));

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

// ----------------------------------------------------------------------

export type NavItemProps = {
  title: string;
  path: string;
  icon?: JSX.Element;
  roles?: boolean;
  info?: JSX.Element;
  onClick?: () => void;
  children?: {
    title: string;
    path: string;
    roles?: boolean;
  }[];
};

function NavItem({ item }: { item: NavItemProps }) {
  const theme = useTheme();
  const { pathname } = useLocation();
  const { title, path, icon, info, children, onClick } = item;
  const isHasActiveSub = children
    ? children.some((item) => item.path && !!matchPath({ path: item.path, end: false }, pathname))
    : false;
  const isActiveRoot = (path && !!matchPath({ path, end: false }, pathname)) || isHasActiveSub;
  const [open, setOpen] = useState(isActiveRoot);

  const handleOpen = () => {
    setOpen(!open);
  };

  const activeRootStyle = {
    color: "primary.main",
    fontWeight: "fontWeightMedium",
    bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    "&:before": { display: "block" },
  };

  const activeSubStyle = {
    color: "text.primary",
    fontWeight: "fontWeightMedium",
  };

  if (children) {
    return (
      <>
        <ListItemStyle
          onClick={handleOpen}
          sx={{
            ...(isActiveRoot && activeRootStyle),
          }}
          style={{ display: item.roles ? undefined : "none" }}
        >
          <ListItemIconStyle>{icon}</ListItemIconStyle>
          <ListItemText disableTypography primary={title} />
          {info}
          <Box
            component={Icon}
            icon={open ? arrowIosDownwardFill : arrowIosForwardFill}
            sx={{ width: 16, height: 16, ml: 1 }}
          />
        </ListItemStyle>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List
            component="div"
            disablePadding
            style={{
              display: item.roles ? undefined : "none",
            }}
          >
            {map(children, (item) => {
              const { title, path } = item;
              const isActiveSub = path ? !!matchPath({ path, end: false }, pathname) : false;

              return (
                <ListItemStyle
                  key={title}
                  component={RouterLink}
                  to={path}
                  sx={{
                    ...(isActiveSub && activeSubStyle),
                  }}
                  style={{
                    display: item.roles ? undefined : "none",
                  }}
                >
                  <ListItemIconStyle>
                    <Box
                      component="span"
                      sx={{
                        width: 4,
                        height: 4,
                        display: "flex",
                        borderRadius: "50%",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "text.disabled",
                        transition: (theme) =>
                          theme.transitions.create("transform", {
                            duration: "0.5s",
                            easing: theme.transitions.easing.easeInOut,
                          }),
                        ...(isActiveSub && {
                          transform: "scale(2)",
                          bgcolor: "primary.main",
                        }),
                      }}
                    />
                  </ListItemIconStyle>
                  <ListItemText disableTypography primary={title} />
                </ListItemStyle>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <ListItemStyle
      component={RouterLink}
      onClick={onClick}
      to={path}
      sx={{
        ...(isActiveRoot && title !== THEME_TITLE && activeRootStyle),
      }}
    >
      <ListItemIconStyle>{icon}</ListItemIconStyle>
      <ListItemText disableTypography primary={title} />
      {info}
    </ListItemStyle>
  );
}

function CollapseNavItem({
  item,
  handleOpen,
  handleClose,
  handleNavigation,
}: {
  item: NavItemProps;
  handleOpen: any;
  handleClose: any;
  handleNavigation: any;
}) {
  const theme = useTheme();
  const { pathname } = useLocation();
  const { title, path, icon, info, children, onClick } = item;
  const isHasActiveSub = children
    ? children.some((item) => item.path && !!matchPath({ path: item.path, end: false }, pathname))
    : false;
  const isActiveRoot = (path && !!matchPath({ path, end: false }, pathname)) || isHasActiveSub;

  return (
    <ListItem
      disablePadding
      sx={{
        color: theme.palette.text.secondary,
        px: 1,
        position: "relative",
      }}
    >
      <ListItemButton
        sx={{
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          borderRadius: 1,
          p: 1,
          position: "relative",
          ...(isActiveRoot &&
            title !== THEME_TITLE && {
              color: theme.palette.primary.main,
              background: alpha(theme.palette.primary.main, 0.1),
              "&:hover": {
                color: theme.palette.primary.main,
                background: alpha(theme.palette.primary.main, 0.1),
              },
            }),
        }}
        onMouseEnter={!!children ? handleOpen(children) : handleClose}
        onClick={() => (title === "Theme" ? onClick && onClick() : handleNavigation(item.path))}
      >
        <ListItemIcon sx={{ mr: 0 }}>{icon}</ListItemIcon>
        <ListItemText
          primary={title}
          sx={{
            ".MuiTypography-root": {
              fontSize: 10,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "64px",
              textAlign: "center",
            },
          }}
        />
        {!!children && (
          <KeyboardArrowRightRoundedIcon
            sx={{ position: "absolute", top: 12, right: 6, fontSize: 14 }}
          />
        )}
      </ListItemButton>
    </ListItem>
  );
}

interface NavSectionProps extends BoxProps {
  isShow?: boolean | undefined;
  navConfig: {
    subheader: string;
    items: NavItemProps[];
  }[];
}

export default function NavSection({ navConfig, isShow = true, ...other }: NavSectionProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [currentMenu, setCurrentMenu] = useState<any>([]);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleOpen = (children: any) => (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
    setCurrentMenu(children);
  };

  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(false);
  };

  const id = `transition-popper`;

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Box {...other} style={{ paddingBottom: 24 }} onMouseLeave={handleClose}>
      {map(navConfig, (list) => {
        const { subheader, items } = list;
        const isShowSubHeader = items.some((item) => item.roles);
        return (
          isShowSubHeader && (
            <List key={subheader} disablePadding>
              {isShow ? (
                <ListSubheaderStyle>{subheader}</ListSubheaderStyle>
              ) : (
                <Divider sx={{ margin: "0 20px" }} />
              )}
              {map(items, (item: NavItemProps) => {
                return item.roles ? (
                  isShow ? (
                    <NavItem key={item.title} item={item} />
                  ) : (
                    <CollapseNavItem
                      key={item.title}
                      item={item}
                      handleOpen={handleOpen}
                      handleClose={handleClose}
                      handleNavigation={handleNavigation}
                    />
                  )
                ) : null;
              })}
            </List>
          )
        );
      })}

      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        transition
        style={{
          zIndex: 1310,
        }}
        placement="right"
        onMouseLeave={handleClose}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={450}>
            <List
              sx={{
                p: 1,
                backgroundColor: alpha(theme.palette.background.default, 0.93),
                boxShadow: theme.customShadows.z12,
                borderRadius: 1,
              }}
            >
              {map(currentMenu, (item, index) => {
                const isActiveSub = item.path
                  ? !!matchPath({ path: item.path, end: false }, pathname)
                  : false;
                return item.roles ? (
                  <ListItemButton
                    key={index}
                    selected={isActiveSub}
                    sx={{ minWidth: 140, borderRadius: 0.5 }}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <ListItemText
                      primary={item.title}
                      sx={{
                        ".MuiTypography-root": {
                          color: theme.palette.text.secondary,
                          fontSize: 14,
                          fontWeight: 500,
                        },
                      }}
                    />
                  </ListItemButton>
                ) : null;
              })}
            </List>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}
