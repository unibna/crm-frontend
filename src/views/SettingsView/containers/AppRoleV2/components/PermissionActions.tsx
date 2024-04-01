import React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  List,
  ListItem,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { SlideTransition } from "components/Transisitions";
import ControlPanel from "./ControlPanel";

export default function PermissionActions({
  roles,
  roleItem,
  open,
  onClose,
  setRoleItem,
  handleUpdateRole,
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
      label: string;
      code: string;
      data: any;
      route: string | null;
    } | null>
  >;
  open: boolean;
  onClose: () => void;
  handleUpdateRole: (id: string | number, name: string, role: any, route: string | null) => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      fullScreen
      keepMounted
      open={open}
      onClose={onClose}
      TransitionComponent={SlideTransition}
      sx={{
        [theme.breakpoints.down("sm")]: {
          ".MuiDialog-paper": {
            m: 0,
          },
        },
      }}
    >
      <DialogContent
        sx={{
          ...styles.dialogContent,
          [theme.breakpoints.down("sm")]: {
            p: "24px",
            pr: "0",
          },
        }}
      >
        <Grid container spacing={2} sx={styles.gridContainer}>
          {!isMobile && (
            <Grid item xs={12} md={4} sx={styles.left}>
              <List dense={false} sx={styles.list}>
                {roles.map((role: any, roleIndex: number) => (
                  <ListItem
                    onClick={() =>
                      setRoleItem({
                        label: role.name,
                        code: role.code,
                        data: role.data,
                        route: role.route.value,
                        id: role.id,
                      })
                    }
                    key={roleIndex}
                    sx={{
                      ...styles.listItem,
                      "&:hover": {
                        boderColor: `${theme.palette.primary.light}`,
                        barckgroundColor: `${theme.palette.primary.light}`,
                        boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px",
                      },
                      ...(roleItem?.id === role.id && {
                        borderColor: `${theme.palette.primary.light}`,
                        backgroundColor: `${theme.palette.primary.light}`,
                        boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px",
                      }),
                    }}
                  >
                    {role.name}
                  </ListItem>
                ))}
              </List>
            </Grid>
          )}

          <Grid
            item
            md={8}
            xs={12}
            sx={{
              ...styles.right,
              [theme.breakpoints.down("sm")]: {
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                MsOverflowStyle: "none",
                scrollbarWidth: "none",
              },
            }}
          >
            <ControlPanel roles={roles} roleItem={roleItem} setRoleItem={setRoleItem} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ ...styles.dialogActions, background: theme.palette.background.default }}>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={onClose}>
            Đóng
          </Button>
          <Button
            variant="contained"
            onClick={() =>
              roleItem &&
              handleUpdateRole &&
              handleUpdateRole(roleItem.id || "", roleItem.label, roleItem.data, roleItem.route)
            }
          >
            Lưu
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

const styles: any = {
  container: {
    position: "relative",
    width: "100%",
  },
  gridContainer: {
    height: "100%",
    overflow: "hidden",
  },
  left: {
    p: 2,
    borderRight: "2px solid #eee",
    height: "100%",
    overflowY: "auto",
  },
  right: {
    p: 2,
    height: "100%",
    overflowY: "auto",
  },
  dialogTitle: {
    borderBottom: "1px solid #eee",
    p: "16px 24px",
  },
  dialogContent: {
    pb: 0,
  },
  dialogActions: {
    borderTop: "1px solid #eee",
    p: 0,
  },
  list: {
    pr: 2,
    borderRadius: "10px",
  },
  listItem: {
    px: 1,
    py: 2,
    cursor: "pointer",
    fontWeight: 600,
    transition: "0.3s all ease-in-out",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:first-child": {
      borderRadius: "10px 10px 0 0",
    },
    "&:last-child": {
      borderRadius: "0 0 10px 10px",
    },
  },
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
};
