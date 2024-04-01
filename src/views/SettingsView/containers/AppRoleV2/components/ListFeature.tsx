import mapValues from "lodash/mapValues";
import React, { useMemo, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, alpha, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ROLE_RENDER } from "constants/roleOptions";
import { ROLE_OPTION, TypeRenderComponent } from "constants/rolesTab";
import { groupBy, standardString } from "utils/helpers";

import { useAppSelector } from "hooks/reduxHook";
import { getListRoles, getOptionRole } from "selectors/roles";

import { Add } from "@mui/icons-material";
import SearchFilter from "components/DDataGrid/components/SearchFilter";
import FormDialog from "components/Dialogs/FormDialog";
import ArrayTag from "./ArrayTag";
import PermissionConfig from "./PermissionConfig";

function ListFeature() {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<any>(
    ROLE_RENDER.reduce((prev, current) => ({ ...prev, [current.name]: false }), {})
  );
  const [searchInput, setSearchInput] = useState<string>("");

  const [permissionConfig, setPermissionConfig] = useState<
    | {
        permissionLabel: string;
        permissionName: string;
        parentPermisionName: string;
        groupByPermission: {
          readAndWrite: {
            id: string;
            name: string;
            route: string;
            data: any;
          }[];
          read: {
            id: string;
            name: string;
            route: string;
            data: any;
          }[];
        };
        isHiddenReadAndWrite: boolean;
        isHiddenRead: boolean;
      }
    | undefined
  >(undefined);

  // const roles = useAppSelector((state) => getAllRoles(state.roles));
  const optionRoles = useAppSelector((state) => getOptionRole(state.roles));
  const listRoles = useAppSelector((state) => getListRoles(state.roles));

  const newRoleRender = ROLE_RENDER.map((item) => {
    const newItemRoles = item.roles.map((role) => {
      const groupByPermission = listRoles.reduce(
        (prev, current) => {
          return {
            readAndWrite:
              current.data?.[item.name]?.[role.name] === ROLE_OPTION.READ_AND_WRITE
                ? [...prev.readAndWrite, { ...current, id: current.id }]
                : prev.readAndWrite,
            read:
              current.data?.[item.name]?.[role.name] === ROLE_OPTION.READ
                ? [...prev.read, { ...current, id: current.id }]
                : prev.read,
          };
        },
        {
          readAndWrite: [],
          read: [],
        }
      );
      return {
        ...role,
        groupByPermission,
        parentPermisionName: item.name,
      };
    });
    return {
      ...item,
      roles: newItemRoles,
    };
  });

  const mapRoles = newRoleRender.flatMap((item) => item.roles);

  const groupPermission = useMemo(() => groupBy(newRoleRender, "group"), [newRoleRender]);

  const dataSearch = useMemo(() => {
    const searchInputStandard = standardString(searchInput);
    return (
      (searchInput &&
        Object.keys(groupPermission).filter((item: string) =>
          groupPermission[item].some((permission: TypeRenderComponent) =>
            standardString(permission.label).includes(searchInputStandard)
          )
        )) ||
      Object.keys(groupPermission)
    );
  }, [searchInput, groupPermission]);

  return (
    <>
      <FormDialog
        open={Boolean(permissionConfig)}
        onClose={() => setPermissionConfig(undefined)}
        maxWidth="lg"
        isShowFooter={false}
        title={permissionConfig?.permissionLabel}
        enableCloseByDropClick
      >
        <PermissionConfig
          parentPermisionName={permissionConfig?.parentPermisionName || ""}
          permissionName={permissionConfig?.permissionName || ""}
          groupByPermission={
            mapRoles.find(
              (item) =>
                item.parentPermisionName === permissionConfig?.parentPermisionName &&
                item.name === permissionConfig?.permissionName
            )?.groupByPermission || { readAndWrite: [], read: [] }
          }
          roles={optionRoles}
          isHiddenReadAndWrite={permissionConfig?.isHiddenReadAndWrite || false}
          isHiddenRead={permissionConfig?.isHiddenRead || false}
        />
      </FormDialog>

      <Stack display="flex" alignItems="center" justifyContent={"space-between"} direction="row">
        <SearchFilter
          label={"Nhập tên tính năng"}
          defaultValue={searchInput}
          renderIcon={<SearchIcon />}
          onSearch={(value: string) => {
            setSearchInput(value);
          }}
          delay={200}
        />
        <Typography
          component={"span"}
          onMouseDown={() => {
            const checkAll = mapValues(
              expanded,
              () => !Object.values(expanded).every((item: boolean) => item)
            );
            setExpanded(checkAll);
          }}
          sx={{
            ...styles.linkSection,
            color: theme.palette.primary.main,
            ...(Object.values(expanded).every((item: boolean) => item) && {
              opacity: 1,
            }),
          }}
        >
          <span>{`Mở/Đóng tất cả`}</span>
          <ExpandMoreIcon
            sx={{
              transform: "rotate(0deg)",
              transition: "transform 0.15s linear",
              ...(Object.values(expanded).every((item: boolean) => item) && {
                transform: "rotate(180deg)",
              }),
            }}
          />
        </Typography>
      </Stack>

      {dataSearch.map((group) => (
        <React.Fragment key={group}>
          <Typography sx={styles.groupName}>{group}</Typography>
          {groupPermission[group].map((permission: TypeRenderComponent) => {
            const isHiddenReadAndWrite = permission.roles?.every(
              (role) => role.isShowRadioReadWrite === false
            );
            const isHiddenRead = permission.roles?.every((role) => role.isShowRadioRead === false);
            return (
              standardString(permission.label).includes(standardString(searchInput)) && (
                <Box key={permission.name} sx={styles.groupItem}>
                  <Grid
                    container
                    sx={{
                      ...styles.roleHeader,
                      backgroundColor: theme.palette.background.neutral,
                    }}
                    spacing={1}
                    onMouseDown={() => {
                      setExpanded({
                        ...expanded,
                        [permission.name]: !expanded[permission.name],
                      });
                    }}
                  >
                    <Grid item xs={4}>
                      <Stack direction="column" spacing={1}>
                        <Typography sx={styles.titleGroupPermission}>{permission.label}</Typography>
                        <Typography
                          component={"span"}
                          onMouseDown={() => {
                            setExpanded({
                              ...expanded,
                              [permission.name]: !expanded[permission.name],
                            });
                          }}
                          sx={{
                            ...styles.linkSection,
                            color: theme.palette.primary.main,
                            ...(expanded[permission.name] && {
                              opacity: 1,
                            }),
                          }}
                        >
                          <span>{`Show ${permission.roles.length} permissions`}</span>
                          <ExpandMoreIcon
                            sx={{
                              transform: "rotate(0deg)",
                              transition: "transform 0.15s linear",
                              ...(expanded[permission.name] && {
                                transform: "rotate(180deg)",
                              }),
                            }}
                          />
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={4}>
                      {!isHiddenReadAndWrite && (
                        <Stack
                          direction="column"
                          spacing={1}
                          justifyContent={"center"}
                          alignItems="center"
                        >
                          <Typography>{`Đọc và ghi`}</Typography>
                          <ModeEditRoundedIcon sx={{ color: theme.palette.primary.main }} />
                        </Stack>
                      )}
                    </Grid>
                    <Grid item xs={4}>
                      {!isHiddenRead && (
                        <Stack
                          direction="column"
                          spacing={1}
                          justifyContent={"center"}
                          alignItems="center"
                        >
                          <Typography>{`Chỉ đọc`}</Typography>
                          <RemoveRedEyeRoundedIcon sx={{ color: theme.palette.primary.main }} />
                        </Stack>
                      )}
                    </Grid>
                  </Grid>
                  {expanded[permission.name] && (
                    <Grow in={expanded[permission.name]}>
                      <Grid container display="flex" alignItems="center">
                        {permission.roles.map((role) => (
                          <Grid
                            container
                            item
                            xs={12}
                            key={role.name}
                            sx={{
                              p: 2,
                              borderBottom: "1px solid #eee",
                              cursor: "pointer",
                              transition: theme.transitions.create("all", {
                                duration: ".15s",
                                easing: theme.transitions.easing.easeInOut,
                              }),
                              "&:hover": {
                                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                              },
                            }}
                            onMouseDown={() => {
                              setPermissionConfig({
                                permissionLabel: role.label,
                                parentPermisionName: permission.name,
                                permissionName: role.name,
                                groupByPermission: role.groupByPermission || {
                                  readAndWrite: [],
                                  read: [],
                                },
                                isHiddenReadAndWrite: role.isShowRadioReadWrite === false,
                                isHiddenRead: role.isShowRadioRead === false,
                              });
                            }}
                          >
                            <Grid item xs={4} sx={{ ...styles.permissionItem, pr: 2 }}>
                              <Typography sx={styles.permissionItemName}>{role.label}</Typography>
                            </Grid>
                            <Grid item xs={4} sx={styles.permissionItem}>
                              {role.isShowRadioReadWrite !== false && (
                                <>
                                  {role?.groupByPermission?.readAndWrite &&
                                  role?.groupByPermission?.readAndWrite.length > 0 ? (
                                    <ArrayTag tags={role.groupByPermission?.readAndWrite as any} />
                                  ) : (
                                    <IconButton sx={{ display: "flex", mx: "auto" }}>
                                      <Add sx={{ color: theme.palette.primary.main }} />
                                    </IconButton>
                                  )}
                                </>
                              )}
                            </Grid>
                            <Grid item xs={4} sx={styles.permissionItem}>
                              {role.isShowRadioRead !== false && (
                                <>
                                  {role?.groupByPermission?.read &&
                                  role?.groupByPermission?.read.length > 0 ? (
                                    <ArrayTag tags={role.groupByPermission?.read as any} />
                                  ) : (
                                    <IconButton sx={{ display: "flex", mx: "auto" }}>
                                      <Add sx={{ color: theme.palette.primary.main }} />
                                    </IconButton>
                                  )}
                                </>
                              )}
                            </Grid>
                          </Grid>
                        ))}
                      </Grid>
                    </Grow>
                  )}
                </Box>
              )
            );
          })}
        </React.Fragment>
      ))}
    </>
  );
}

export default ListFeature;

const styles: any = {
  titleSection: {
    fontWeight: 700,
    mb: 1,
  },
  linkSection: {
    cursor: "pointer",
    opacity: 0.7,
    transition: "all .2s ease-in-out",
    fontWeight: 600,
    fontSize: "0.8125rem",
    display: "flex",
    alignItems: "center",
    "&: hover": {
      opacity: 1,
    },
  },

  roleHeader: {
    borderRadius: "8px",
    p: 2,
    border: "2px solid #eee",
    cursor: "pointer",
  },
  permissionItem: {
    py: 2,
  },
  titleGroupPermission: {
    fontWeight: 600,
  },
  groupName: {
    fontWeight: 600,
    fontSize: "0.8125rem",
    pt: 1,
    pb: 2,
  },
  groupItem: {
    "&:not(:last-child)": {
      mb: 2,
    },
  },
};
