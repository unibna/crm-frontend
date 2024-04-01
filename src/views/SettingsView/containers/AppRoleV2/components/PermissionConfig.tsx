import React, { useMemo, useState } from "react";

import Add from "@mui/icons-material/Add";
import {
  Avatar,
  Chip,
  IconButton,
  List,
  MenuItem,
  Popover,
  Stack,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";

import { MTextLine } from "components/Labels";

import { ROLE_OPTION, ROLE_TYPE } from "constants/rolesTab";

import { standardString } from "utils/helpers";

import { updateRoleAction } from "store/redux/roles/slice";

import FormDialog from "components/Dialogs/FormDialog";
import { useAppSelector } from "hooks/reduxHook";
import { getAllRoles } from "selectors/roles";
import { userStore } from "store/redux/users/slice";
import EditText from "views/AirtableV2/components/EditText";

export type Role = {
  label: string;
  value: string;
};

function PermissionConfig({
  parentPermisionName,
  permissionName,
  groupByPermission,
  roles,
  isHiddenReadAndWrite,
  isHiddenRead,
}: {
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
  roles: Role[];
  isHiddenReadAndWrite: boolean;
  isHiddenRead: boolean;
}) {
  const allRoles = useAppSelector((state) => getAllRoles(state.roles));

  const handleRemoveGroup = (groupId: string) => {
    const group = allRoles[groupId];
    group &&
      updateRoleAction({
        ...group,
        id: groupId,
        data: {
          ...group.data,
          [parentPermisionName]: {
            ...group.data[parentPermisionName],
            [permissionName]: ROLE_OPTION.NO_PERMISSION,
          },
        },
      });
  };

  const handleAddGroup = (roleType: ROLE_TYPE) => (groupId: string) => {
    const group = allRoles[groupId];
    group &&
      updateRoleAction({
        ...group,
        id: groupId,
        data: {
          ...group.data,
          [parentPermisionName]: {
            ...group.data[parentPermisionName],
            [permissionName]: roleType,
          },
        },
      });
  };

  return (
    <Stack direction="column" spacing={1.5} sx={{ width: "100%", p: 1 }}>
      {!isHiddenReadAndWrite && (
        <MTextLine
          displayType="grid"
          label={
            <Typography variant="body2" fontWeight={600}>
              {"Đọc và ghi:"}
            </Typography>
          }
          xsLabel={4}
          xsValue={8}
          value={
            <PermissionAction
              groups={groupByPermission.readAndWrite.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
              permissionType={ROLE_OPTION.READ_AND_WRITE}
              roles={roles}
              onAddGroup={handleAddGroup(ROLE_OPTION.READ_AND_WRITE)}
              onRemoveGroup={handleRemoveGroup}
            />
          }
        />
      )}

      {!isHiddenRead && (
        <MTextLine
          displayType="grid"
          xsLabel={4}
          xsValue={8}
          label={
            <Typography variant="body2" fontWeight={600}>
              {"Chỉ đọc:"}
            </Typography>
          }
          value={
            <PermissionAction
              groups={groupByPermission.read.map((item) => ({ label: item.name, value: item.id }))}
              permissionType={ROLE_OPTION.READ}
              roles={roles}
              onAddGroup={handleAddGroup(ROLE_OPTION.READ)}
              onRemoveGroup={handleRemoveGroup}
            />
          }
        />
      )}
    </Stack>
  );
}

export default PermissionConfig;

const PermissionAction = ({
  groups,
  roles,
  permissionType,
  onRemoveGroup,
  onAddGroup,
}: {
  groups: { label: string; value: string; isDisabled?: boolean }[];
  roles: Role[];
  permissionType: ROLE_TYPE;
  onRemoveGroup: (groupId: string) => void;
  onAddGroup: (groupId: string) => void;
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [group, setGroup] = useState<
    | {
        label: string;
        value: string;
        isDisabled?: boolean | undefined;
      }
    | undefined
  >(undefined);

  const { activeUsers } = useAppSelector(userStore);

  const users = useMemo(() => {
    return (
      activeUsers.filter((item) => +(item.group_permission?.id || "") === +(group?.value || "")) ||
      []
    );
  }, [activeUsers, group?.value]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? `${permissionType}-permission-popover` : undefined;

  const remainRoles = roles.filter((role) => !groups.some((group) => group.value === role.value));

  return (
    <div>
      <FormDialog
        open={Boolean(group)}
        onClose={() => setGroup(undefined)}
        isShowFooter={false}
        title={group?.label}
        enableCloseByDropClick
      >
        <Stack direction="row" gap={2} flexWrap="wrap">
          {users.map((user) => (
            <Chip
              key={user.id}
              label={user.name}
              avatar={<Avatar alt={user.name} src={user.image?.url} />}
            />
          ))}
        </Stack>
      </FormDialog>
      <Stack
        direction="row"
        spacing={0.5}
        flexWrap="wrap"
        gap={"8px"}
        sx={{
          ...(groups.length > 0 && {
            border: `1.8px solid ${theme.palette.primary.main}`,
            borderRadius: "8px",
            p: 1,
          }),
        }}
      >
        {groups.map((group) => (
          <Chip
            label={group.label}
            key={group.value}
            onDelete={() => onRemoveGroup(group.value)}
            onClick={() => setGroup(group)}
          />
        ))}

        <Tooltip title="Chọn nhóm">
          <IconButton
            onClick={handleClick}
            sx={{
              width: 28,
              height: 28,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              ".MuiSvgIcon-root": {
                fontSize: "1rem",
              },
            }}
          >
            <Add />
          </IconButton>
        </Tooltip>
      </Stack>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <ListRoles roles={remainRoles} onAddGroup={onAddGroup} onClose={handleClose} />
      </Popover>
    </div>
  );
};

const ListRoles = ({
  roles,
  onAddGroup,
  onClose,
}: {
  roles: Role[];
  onAddGroup: (groupId: string) => void;
  onClose: () => void;
}) => {
  const [search, setSearch] = useState<string>("");
  return (
    <List sx={{ maxHeight: "300px", overflowY: "auto", position: "relative" }}>
      <EditText
        value={search}
        sx={{
          bgcolor: "background.paper",
          position: "sticky",
          top: 0,
          px: 2,
          py: 1,
          mb: 1,
          zIndex: 2,
          "& .MuiInputBase-root": {
            overflow: "hidden",
            textOverflow: "ellipsis",
            borderRadius: 0,
          },
        }}
        onChange={(e: any) => {
          setSearch(e.target.value);
        }}
        placeholder="Nhập để tìm kiếm"
      />
      {roles
        .filter((item) =>
          search ? standardString(item.label).includes(standardString(search)) : true
        )
        .map((role) => (
          <MenuItem
            key={role.value}
            value={role.value}
            onClick={() => {
              onAddGroup(role.value);
              onClose();
            }}
          >
            <Chip label={role.label} key={role.value} />
          </MenuItem>
        ))}
    </List>
  );
};
