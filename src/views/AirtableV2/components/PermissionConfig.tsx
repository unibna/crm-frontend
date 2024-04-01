import React, { useEffect, useState } from "react";

import Add from "@mui/icons-material/Add";
import { alpha, useTheme, Theme, SxProps } from "@mui/material";

import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import { MButton } from "components/Buttons";
import { MTextLine } from "components/Labels";
import Tag from "./Tag";

import { ROLE_TYPE, ROLE_OPTION, STATUS_ROLE_SKYCOM_TABLE, ROLE_TAB } from "constants/rolesTab";

import { randomHSLA } from "utils/helpers";
import { standardString } from "utils/helpers";
import EditText from "./EditText";
import { useAppSelector } from "hooks/reduxHook";
import { getAllRoles } from "selectors/roles";
import { isReadAndWriteRole } from "utils/roleUtils";
import useAuth from "hooks/useAuth";

export type Role = {
  label: string;
  value: string;
};

const initData: {
  readGroups: Role[];
  editGroups: Role[];
} = {
  readGroups: [],
  editGroups: [],
};

function PermissionConfig({
  permission = {},
  roles,
  containerStyles,
  onChangePermission,
  onClose,
}: {
  permission?: {
    [key: string]: ROLE_TYPE;
  };
  roles: Role[];
  containerStyles?: SxProps<Theme>;
  onChangePermission: (newPermission: any) => void;
  onClose: () => void;
}) {
  const allRoles = useAppSelector((state) => getAllRoles(state.roles));
  const { user } = useAuth();
  const [state, setState] = useState<{
    [key: string]: ROLE_TYPE;
  }>({});

  useEffect(() => {
    setState(permission);
  }, []);

  const handleSubmit = () => {
    onChangePermission(state);
    onClose();
  };

  const fullPermissionRoles = Object.keys(allRoles).reduce(
    (prev: { label: string; value: string; isDisabled?: boolean }[], groupId: string) => {
      if (
        isReadAndWriteRole(
          user?.is_superuser,
          allRoles[groupId].data?.[ROLE_TAB.SKYCOM_TABLE]?.[STATUS_ROLE_SKYCOM_TABLE.HANDLE]
        )
      ) {
        prev = [
          ...prev,
          {
            label: allRoles[groupId].name,
            value: groupId,
            isDisabled: true,
          },
        ];
      }
      return prev;
    },
    []
  );

  /**
   * @param groupId id nhóm quyền
   */
  const filterData =
    (state &&
      Object.keys(state).reduce((prev, groupId: string) => {
        const role = roles.find((item) => item.value === groupId);
        const isFullPermission = fullPermissionRoles.some((item) => item.value === groupId);
        return {
          readGroups:
            role && state[groupId] === ROLE_OPTION.READ && !isFullPermission
              ? [...prev.readGroups, role]
              : prev.readGroups,
          editGroups:
            role && state[groupId] === ROLE_OPTION.READ_AND_WRITE && !isFullPermission
              ? [...prev.editGroups, role]
              : prev.editGroups,
        };
      }, initData)) ||
    initData;

  const handleRemoveGroup = (groupId: string) => {
    delete state?.[groupId];
    setState({ ...state });
  };

  const handleAddGroup = (roleType: ROLE_TYPE) => (groupId: string) => {
    state[groupId] = roleType;
    setState({ ...state });
  };

  return (
    <Stack direction="column" spacing={1.5} sx={{ width: 420, p: 1, ...containerStyles }}>
      <Typography variant="h6">Chỉnh sửa quyền</Typography>
      <Divider />
      <MTextLine
        displayType="grid"
        xsLabel={4}
        xsValue={8}
        label={
          <Typography variant="body2" fontWeight={600}>
            {"Quyền xem:"}
          </Typography>
        }
        value={
          <PermissionAction
            groups={filterData.readGroups}
            permissionType={ROLE_OPTION.READ}
            roles={roles}
            onAddGroup={handleAddGroup(ROLE_OPTION.READ)}
            onRemoveGroup={handleRemoveGroup}
          />
        }
      />
      <MTextLine
        displayType="grid"
        label={
          <Typography variant="body2" fontWeight={600}>
            {"Quyền chỉnh sửa:"}
          </Typography>
        }
        xsLabel={4}
        xsValue={8}
        value={
          <PermissionAction
            groups={[...filterData.editGroups, ...fullPermissionRoles]}
            permissionType={ROLE_OPTION.READ_AND_WRITE}
            roles={roles}
            onAddGroup={handleAddGroup(ROLE_OPTION.READ_AND_WRITE)}
            onRemoveGroup={handleRemoveGroup}
          />
        }
      />
      <Stack direction="row" justifyContent={"flex-end"} mt={1}>
        <MButton onClick={handleSubmit}>Cập nhật</MButton>
      </Stack>
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
      <Stack
        direction="row"
        spacing={0.5}
        flexWrap="wrap"
        gap={"8px"}
        sx={{
          maxHeight: 300,
          overflowY: "auto",
          ...(groups.length > 0 && {
            border: `1.8px solid ${theme.palette.primary.main}`,
            borderRadius: "8px",
            p: 1,
          }),
        }}
      >
        {groups.map((group, groupIndex) => (
          <Tag
            label={group.label}
            color={randomHSLA(groupIndex)}
            key={group.value}
            isShowEdit={!group.isDisabled}
            onDelete={() => onRemoveGroup(group.value)}
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
        .map((role, roleIndex) => (
          <MenuItem
            key={role.value}
            value={role.value}
            onClick={() => {
              onAddGroup(role.value);
              onClose();
            }}
          >
            <Tag label={role.label} color={randomHSLA(roleIndex)} key={role.value} />
          </MenuItem>
        ))}
    </List>
  );
};
