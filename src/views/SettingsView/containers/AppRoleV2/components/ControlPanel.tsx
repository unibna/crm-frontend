import React, { useMemo } from "react";
import mapValues from "lodash/mapValues";

import {
  Autocomplete,
  Box,
  Grid,
  Grow,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { IOSSwitch } from "components/Switches";

import { ROLE_RENDER } from "constants/roleOptions";
import { ROLE_OPTION, ROLE_TYPE, TypeRenderComponent } from "constants/rolesTab";
import { DIRECTION_ROUTE_OPTIONS } from "constants/directionRouter";
import { groupBy } from "utils/helpers";

function ControlPanel({
  roles,
  roleItem,
  setRoleItem,
  isCreate,
}: {
  roles: any;
  roleItem: {
    id?: number | string;
    label: string;
    code: string;
    data: any;
    route: string | null;
  } | null;
  setRoleItem: React.Dispatch<
    React.SetStateAction<{
      id?: number | string;
      label?: string;
      code?: string;
      data?: any;
      route?: string | null;
    } | null>
  >;
  isCreate?: boolean;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expanded, setExpanded] = React.useState<any>(
    ROLE_RENDER.reduce((prev, current) => ({ ...prev, [current.name]: false }), {})
  );

  const groupPermission = useMemo(() => groupBy(ROLE_RENDER, "group"), []);

  const findLengthPermissonGroupByRoleType = (
    permission: TypeRenderComponent,
    rolItemData: any,
    roleType: ROLE_TYPE
  ) => {
    return permission.roles.reduce((prev: number, current: any) => {
      prev += rolItemData?.[permission.name]?.[current.name] === roleType ? 1 : 0;
      return prev;
    }, 0);
  };

  const handleChange = (name: string) => (value: string) => {
    setRoleItem({
      ...roleItem,
      [name]: value,
    });
  };

  const handleChangePermission =
    (permission: TypeRenderComponent, roleName: string, roleType: ROLE_TYPE) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newRoleItem = {
        ...roleItem,
        data: {
          ...roleItem?.data,
          [permission.name]:
            permission?.roles?.reduce((prev, current) => {
              return {
                ...prev,
                [current.name]:
                  roleItem?.data?.[permission.name]?.[current.name] || ROLE_OPTION.NO_PERMISSION,
              };
            }, {}) || {},
        },
      };

      newRoleItem.data[permission.name][roleName] = e.target.checked
        ? roleType
        : ROLE_OPTION.NO_PERMISSION;

      setRoleItem(newRoleItem);
    };

  const handleChangePermissionGroup =
    (permission: TypeRenderComponent, roleType: ROLE_TYPE) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newRoleItem = {
        ...roleItem,
        data: {
          ...roleItem?.data,
          [permission.name]:
            permission?.roles?.reduce((prev, current) => {
              return {
                ...prev,
                [current.name]: e.target.checked
                  ? (roleType === ROLE_OPTION.READ_AND_WRITE &&
                      current.isShowRadioReadWrite === false) ||
                    (roleType === ROLE_OPTION.READ && current.isShowRadioRead === false)
                    ? current.name
                    : roleType
                  : ROLE_OPTION.NO_PERMISSION,
              };
            }, {}) || {},
        },
      };

      setRoleItem(newRoleItem);
      !expanded[permission.name] &&
        setExpanded({
          ...expanded,
          [permission.name]: true,
        });
    };

  return (
    <>
      {(isMobile || isCreate) && (
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ ...styles.titleSection, mb: 2 }}>
            {isCreate ? "Quyền mẫu" : "Roles"}
          </Typography>
          <Autocomplete
            disablePortal
            id="roles-autocomplete"
            options={roles.map((role: any) => ({ label: role.name.value, value: role.id }))}
            renderInput={(params) => <TextField {...params} label="Roles" />}
            value={{ ...roleItem, value: roleItem?.id }}
            onChange={(e, role) => {
              const temp = roles.find((roleTemp: any) => roleTemp.id === role?.value);
              temp &&
                setRoleItem({
                  label: temp?.name?.value,
                  code: temp?.code,
                  data: temp?.data,
                  route: temp?.route?.value,
                  id: temp?.id,
                });
            }}
            isOptionEqualToValue={(option, value) => option.value === value.value}
          />
        </Box>
      )}

      {!isCreate && (
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ ...styles.titleSection, mb: 2 }}>Chi tiết nhóm quyền</Typography>
          <Stack direction={"row"} spacing={2}>
            <>
              <TextField
                label="Tên nhóm"
                value={roleItem?.label}
                onChange={(e) => handleChange("label")(e.target.value)}
                placeholder="Nhập tên nhóm"
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Mã nhóm"
                value={roleItem?.code}
                onChange={(e) => handleChange("value")(e.target.value)}
                placeholder="Nhập mã nhóm"
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: true }}
                disabled
              />
            </>
            <Autocomplete
              disablePortal
              id="route-autocomplete"
              options={DIRECTION_ROUTE_OPTIONS}
              renderInput={(params) => <TextField {...params} label="Đường dẫn mặc định" />}
              value={DIRECTION_ROUTE_OPTIONS.find((item) => item.value === roleItem?.route) || null}
              onChange={(e, route) => handleChange("route")(route?.value?.toString() || "")}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              fullWidth
            />
          </Stack>
        </Box>
      )}

      <Stack display="flex" alignItems="center" justifyContent={"space-between"} direction="row">
        <Typography sx={styles.titleSection}>Chi tiết quyền</Typography>
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

      {Object.keys(groupPermission).map((group) => {
        return (
          <React.Fragment key={group}>
            <Typography sx={styles.groupName}>{group}</Typography>
            {groupPermission[group].map((permission: TypeRenderComponent) => {
              const permissionReadAndWriteLength = findLengthPermissonGroupByRoleType(
                permission,
                roleItem?.data,
                ROLE_OPTION.READ_AND_WRITE
              );

              const permissionReadOnlyLength = findLengthPermissonGroupByRoleType(
                permission,
                roleItem?.data,
                ROLE_OPTION.READ
              );

              const isHiddenTotalReadAndWriteRole = permission.roles.reduce((prev, cur) => {
                const isHidden = cur.isShowRadioReadWrite === false ? 1 : 0;
                return (prev += isHidden);
              }, 0);

              const isHiddenTotalReadRole = permission.roles.reduce((prev, cur) => {
                const isHidden = cur.isShowRadioRead === false ? 1 : 0;
                return (prev += isHidden);
              }, 0);

              return (
                <Box key={permission.name} sx={styles.groupItem}>
                  <Grid
                    container
                    sx={{
                      ...styles.roleHeader,
                      backgroundColor: theme.palette.background.neutral,
                    }}
                    spacing={1}
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
                      {isHiddenTotalReadAndWriteRole !== permission.roles.length && (
                        <Stack direction="column" spacing={1}>
                          <Typography>{`Đọc và ghi${
                            permissionReadAndWriteLength > 0
                              ? ` (${permissionReadAndWriteLength})`
                              : ""
                          }`}</Typography>
                          <IOSSwitch
                            sx={{ mt: 1 }}
                            checked={permissionReadAndWriteLength > 0}
                            onChange={handleChangePermissionGroup(
                              permission,
                              ROLE_OPTION.READ_AND_WRITE
                            )}
                          />
                        </Stack>
                      )}
                    </Grid>
                    <Grid item xs={4}>
                      {isHiddenTotalReadRole !== permission.roles.length && (
                        <Stack direction="column" spacing={1}>
                          <Typography>{`Chỉ đọc${
                            permissionReadOnlyLength > 0 ? ` (${permissionReadOnlyLength})` : ""
                          }`}</Typography>
                          <IOSSwitch
                            sx={{ mt: 1 }}
                            checked={permissionReadOnlyLength > 0}
                            onChange={handleChangePermissionGroup(permission, ROLE_OPTION.READ)}
                          />
                        </Stack>
                      )}
                    </Grid>
                  </Grid>
                  {expanded[permission.name] && (
                    <Grow in={expanded[permission.name]}>
                      <Grid container sx={{ p: 2 }} display="flex" alignItems="center">
                        {permission.roles.map((role) => {
                          return (
                            <Grid
                              container
                              item
                              xs={12}
                              key={role.name}
                              sx={{ borderBottom: "1px solid #eee" }}
                            >
                              <Grid item xs={4} sx={{ ...styles.permissionItem, pr: 2 }}>
                                <Typography sx={styles.permissionItemName}>{role.label}</Typography>
                              </Grid>
                              <Grid item xs={4} sx={styles.permissionItem}>
                                {role.isShowRadioReadWrite !== false && (
                                  <IOSSwitch
                                    checked={
                                      roleItem?.data?.[permission.name]?.[role.name] ===
                                      ROLE_OPTION.READ_AND_WRITE
                                    }
                                    onChange={handleChangePermission(
                                      permission,
                                      role.name,
                                      ROLE_OPTION.READ_AND_WRITE
                                    )}
                                  />
                                )}
                              </Grid>
                              <Grid item xs={4} sx={styles.permissionItem}>
                                {role.isShowRadioRead !== false && (
                                  <IOSSwitch
                                    checked={
                                      roleItem?.data?.[permission.name]?.[role.name] ===
                                      ROLE_OPTION.READ
                                    }
                                    onChange={handleChangePermission(
                                      permission,
                                      role.name,
                                      ROLE_OPTION.READ
                                    )}
                                  />
                                )}
                              </Grid>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Grow>
                  )}
                </Box>
              );
            })}
          </React.Fragment>
        );
      })}
    </>
  );
}

export default ControlPanel;

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
