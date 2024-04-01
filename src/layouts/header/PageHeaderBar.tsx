import { useMemo } from "react";

import { matchPath, useLocation } from "react-router-dom";
import useAuth from "hooks/useAuth";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Searchbar from "./Searchbar";
import sidebarConfig from "layouts/navbar/SidebarConfig";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material";
import { Link } from "@mui/material";

function PageHeaderBar() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const configs = sidebarConfig({
    pathname,
    userGroupId: user?.group_permission?.id || "",
    handleShowThemeModal: () => {},
    roles: user?.group_permission?.data,
  }).map((item) => {
    item.items = item.items
      .filter((role) => role.code !== "theme" && role.roles)
      .map((role) => ({
        ...role,
        children: role?.children?.filter((roleChildren) => roleChildren.roles),
      }));
    return item;
  });

  const headerInfo = useMemo(() => {
    let fGroupIndex = -1;
    let fItemIndex = -1;
    let fItemChildrenIndex = -1;

    configs.forEach((config, configIndex) => {
      if (fGroupIndex !== -1) return;

      config.items.forEach((item, itemIndex) => {
        if (fItemIndex !== -1) return;

        if (item.children) {
          item.children.forEach((itemChildren, itemChildrenIndex) => {
            if (fItemChildrenIndex !== -1) return;
            if (
              itemChildren.path &&
              !!matchPath({ path: itemChildren.path, end: false }, pathname)
            ) {
              fItemChildrenIndex = itemChildrenIndex;
              fItemIndex = itemIndex;
              fGroupIndex = configIndex;
            }
          });
        } else {
          if (item.path && !!matchPath({ path: item.path, end: false }, pathname)) {
            fItemIndex = itemIndex;
            fGroupIndex = configIndex;
          }
        }
      });
    });

    return {
      group: configs?.[fGroupIndex],
      item: configs?.[fGroupIndex]?.items?.[fItemIndex],
      itemChildren: configs?.[fGroupIndex]?.items?.[fItemIndex]?.children?.[fItemChildrenIndex],
    };
  }, [configs, pathname]);

  return (
    <Stack direction="row" spacing={1} alignItems={"flex-start"} pt={2} pb={1} pl={1}>
      <Stack direction={"column"} spacing={1}>
        {/* <Stack direction={"row"} spacing={1} alignItems="center">
          <Typography variant="h4">{headerInfo?.item?.title}</Typography>
          <Searchbar configs={configs} />
        </Stack> */}

        {/* <Breadcrumbs
          separator={
            <Box
              sx={{
                width: "4px",
                height: "4px",
                backgroundColor: "text.disabled",
                borderRadius: "50%",
              }}
            />
          }
          aria-label="breadcrumb"
        >
          <Typography key="1" color="text.primary" variant="body2">
            {headerInfo?.group?.subheader}
          </Typography>
          {!headerInfo?.itemChildren ? (
            <Typography key="2" color={"text.disabled"} variant="body2">
              {headerInfo?.item?.title}
            </Typography>
          ) : (
            <Link href={`/${headerInfo?.item?.path}`} key="2" color="text.primary" variant="body2">
              {headerInfo?.item?.title}
            </Link>
          )}
          {headerInfo?.itemChildren && (
            <Typography key="3" color={"text.disabled"} variant="body2">
              {headerInfo?.itemChildren?.title}
            </Typography>
          )}
        </Breadcrumbs> */}
      </Stack>
    </Stack>
  );
}

export default PageHeaderBar;
