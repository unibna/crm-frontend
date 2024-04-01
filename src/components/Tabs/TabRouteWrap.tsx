// material
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { SxProps, Theme } from "@mui/material";
import { Page } from "components/Page";
import map from "lodash/map";
import findIndex from "lodash/findIndex";
import React, { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { a11yPropsUtil } from "utils/a11yPropsUtil";

export interface RouteType {
  path: string;
  label: React.ReactNode;
  roles: boolean;
  icon?: string | React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}

interface Props {
  routes: RouteType[];
  children?: React.ReactNode;
  title?: string;
  setTabValue?: (value: number) => void;
  renderLabel?: (tab: RouteType) => JSX.Element;
  sx?: SxProps<Theme>;
}

export const TabRouteWrap = ({
  routes,
  children,
  setTabValue,
  title = "",
  renderLabel,
  sx,
}: Props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue && setTabValue(newValue);
    navigate(`${routes[newValue].path}`);
  };

  const value: number | boolean = useMemo(
    () => findIndex(routes, (item) => item.roles && item.path === pathname),
    [pathname, routes]
  );

  return (
    <Page title={title}>
      <Box sx={{ width: "100%", height: "100%", ...sx }}>
        <Box sx={{ mb: 0, py: 2 }}>
          <Tabs
            value={value < 0 ? false : value}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              ".MuiTabScrollButton-root.Mui-disabled": {
                opacity: 0.3,
              },
            }}
          >
            {map(routes, (tab, index) =>
              tab?.roles ? (
                <Tab
                  label={renderLabel ? renderLabel(tab) : tab.label}
                  value={index}
                  icon={tab.icon}
                  {...a11yPropsUtil(index)}
                  key={index}
                />
              ) : null
            )}
          </Tabs>
        </Box>
        {children ? children : <Outlet />}
      </Box>
    </Page>
  );
};
