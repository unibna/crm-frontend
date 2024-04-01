// Libraries
import { useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import some from "lodash/some";
import reduce from "lodash/reduce";
import map from "lodash/map";
import filter from "lodash/filter";
import { store } from "store";

// Hooks
import usePopup from "hooks/usePopup";
import { useAppDispatch, useAppSelector } from "hooks/reduxHook";
import { fetchAllUsersGroup, userStore } from "store/redux/users/slice";
import { updateUserAction } from "store/redux/users/action";
import { rolesStore } from "store/redux/roles/slice";

// Services
import { userApi } from "_apis_/user.api";

// Components
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import AddIcon from "@mui/icons-material/Add";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import MImage from "components/Images/MImage";
import Checkbox from "@mui/material/Checkbox";
import SearchIcon from "@mui/icons-material/Search";
import { MultiSelect } from "components/Selectors";
import { MButton } from "components/Buttons";
import { Span } from "components/Labels";

// Constants & Utils
import {
  contentRenderDefault,
  TitlePopupHandle,
  TypeHandle,
} from "views/SettingsView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { UserType } from "_types_/UserType";
import { useEffect } from "react";
import { handleParams } from "utils/formatParamsUtil";
import { statusNotification } from "constants/index";

// ------------------------------------------------------

const AccountItem = (props: {
  item: UserType;
  usersGroup: { id: string; name: string; extra?: Partial<any> }[];
}) => {
  const { item: itemRow, usersGroup: usersGroupRender } = props;
  const theme = useTheme();
  const dispatchStoreRedux = useAppDispatch();
  const { setNotifications } = usePopup();

  const handleCheckGroup = (
    checked: boolean,
    itemColumn: { id: string; value: string; label: string; color: string }
  ) => {
    const arrGroupUserId = reduce(
      itemRow?.group_user,
      (prevArr: any, current: any) => {
        return [...prevArr, current.id];
      },
      []
    );

    const newGroupUser = checked
      ? [...(arrGroupUserId || []), itemColumn.id]
      : filter(arrGroupUserId, (item) => item !== itemColumn.id);

    const objData: any = {
      group_user: newGroupUser,
      id: itemRow.id,
      group_permission: {
        id: getObjectPropSafely(() => itemRow?.group_permission?.id),
      },
    };

    dispatchStoreRedux(updateUserAction(objData));

    setNotifications({
      message: "Cập nhật thành công",
      variant: statusNotification.SUCCESS,
    });
  };

  return (
    <Grid item container xs={12}>
      <Grid item container direction="row" alignContent="center" xs={2}>
        <Grid item xs={1.9}>
          <MImage
            src={getObjectPropSafely(() => itemRow.image?.url)}
            preview
            style={{ borderRadius: "50%" }}
            contentImage={<Avatar alt={""} src={getObjectPropSafely(() => itemRow.image?.url)} />}
          />
        </Grid>
        <Grid item xs={10.1}>
          <Box sx={{ ml: 2 }}>
            <Typography variant="body2">{itemRow.name}</Typography>
            {getObjectPropSafely(() => itemRow?.group_permission?.name) ? (
              <Span variant={theme.palette.mode === "light" ? "ghost" : "filled"} color="primary">
                {getObjectPropSafely(() => itemRow?.group_permission?.name)}
              </Span>
            ) : null}
          </Box>
        </Grid>
      </Grid>
      <Grid item container xs={10} columnGap={2}>
        {map(
          usersGroupRender,
          (item: { id: string; value: string; label: string; color: string }) => {
            const isChecked = some(itemRow.group_user, (option) => option.id === item.id);

            return (
              <Grid item xs={0.5}>
                <Checkbox
                  color="primary"
                  checked={isChecked}
                  onChange={(e) => handleCheckGroup(e.target.checked, item)}
                />
              </Grid>
            );
          }
        )}
      </Grid>
    </Grid>
  );
};

const AttachGroup = (props: {
  users: UserType[];
  usersGroup: { id: string; name: string; extra?: Partial<any> }[];
}) => {
  const { users, usersGroup: usersGroupRender } = props;

  return (
    <Card sx={{ p: 3 }}>
      <Grid container>
        <Grid item xs={2}></Grid>
        <Grid item container xs={10} columnGap={2}>
          {map(usersGroupRender, (item: { value: string; label: string; color: string }) => (
            <Grid item xs={0.5} className="ellipsis-label">
              <Typography
                variant="subtitle2"
                // sx={{ textTransform: "uppercase" }}
              >
                {item.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Box
        sx={{
          height: 500,
          overflow: "auto",
        }}
      >
        <Grid container spacing={2}>
          {map(users, (item) => (
            <AccountItem item={item} usersGroup={usersGroupRender} />
          ))}
        </Grid>
      </Box>
    </Card>
  );
};

const Group = () => {
  const { setNotifications, setDataPopup, dataPopup, dataForm } = usePopup<{
    name: string;
    color: string;
  }>();
  const userSlice = useAppSelector(userStore);
  const rolesSlice = useAppSelector(rolesStore);
  const { usersGroup = [], users } = userSlice;
  const [name, setName] = useState("");
  const [filterRole, setFilterRole] = useState<string | string[]>("all");
  const [filterGroup, setFilterGroup] = useState<string | string[]>("all");

  useEffect(() => {
    if (Object.values(dataForm).length) {
      submitPopup();
    }
  }, [dataForm]);

  const submitPopup = async () => {
    const { name, color = "" } = dataForm;
    switch (dataPopup.title) {
      case TitlePopupHandle.CREATE_GROUP_ACCOUNT: {
        const params = {
          name: name,
          extra: {
            color,
          },
        };

        const result: any = await userApi.create(handleParams(params), "user-group/");

        if (result && result.data) {
          const newDataUsersGroup = [
            ...usersGroup,
            {
              ...result.data,
              value: getObjectPropSafely(() => result.data.id),
              label: getObjectPropSafely(() => result.data.name),
            },
          ];

          store.dispatch(fetchAllUsersGroup(newDataUsersGroup));

          setNotifications({
            message: "Tạo nhóm thành công",
            variant: statusNotification.SUCCESS,
          });

          setDataPopup({
            ...dataPopup,
            isOpenPopup: false,
            isLoadingButton: false,
          });
        } else {
          setNotifications({
            message: "Tạo nhóm thất bại",
            variant: statusNotification.ERROR,
          });
        }
        break;
      }
    }
  };

  const handleOpenPopup = (type: string) => {
    let typeProduct = "";
    let funcContentSchema: any;
    let buttonTextPopup = "Tạo";
    let newContentRender = () => contentRenderDefault[type] || [];
    let defaultData = {};

    switch (type) {
      case TitlePopupHandle.CREATE_GROUP_ACCOUNT: {
        typeProduct = TypeHandle.CREATE_GROUP_ACCOUNT;
        funcContentSchema = (yup: any) => {
          return {
            name: yup.string().required("Vui lòng nhập tên nhóm"),
            color: yup.string().required("Vui lòng chọn màu cho nhóm"),
          };
        };
        defaultData = {
          name: "",
          color: "",
        };
        break;
      }
    }

    setDataPopup({
      ...dataPopup,
      buttonText: buttonTextPopup,
      isOpenPopup: true,
      title: type,
      defaultData,
      type: typeProduct,
      funcContentRender: newContentRender,
      funcContentSchema,
    });
  };

  const usersNew = useMemo(() => {
    return filter(users, (item) => item.is_active);
  }, [users]);

  const newDataUsers = useMemo(() => {
    const newUsers = name
      ? usersNew.filter((item: any) => {
          return (
            getObjectPropSafely(() => item.name.toLowerCase().indexOf(name.toLowerCase())) !== -1
          );
        })
      : usersNew;

    const newUsersRole =
      filterRole === "all"
        ? newUsers
        : filter(newUsers, (item) =>
            filterRole.includes(getObjectPropSafely(() => item?.group_permission?.id) + "")
          );

    return filterGroup === "all"
      ? newUsersRole
      : filter(newUsersRole, (item) =>
          some(item.group_user, (option) =>
            filterGroup.includes(getObjectPropSafely(() => option?.id))
          )
        );
  }, [name, usersNew, filterRole, filterGroup]);

  const newUsersGroup = useMemo(() => {
    return filterGroup === "all"
      ? usersGroup
      : filter(usersGroup, (item) =>
          filterGroup.includes(getObjectPropSafely(() => item?.id) + "")
        );
  }, [usersGroup, filterGroup]);

  const newOptionUsersGroup = useMemo(() => {
    return map(usersGroup, (item: any) => ({
      ...item,
      value: item.id,
      label: item.name,
    }));
  }, [usersGroup]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Stack sx={{ p: 2 }} direction="row" justifyContent="space-between">
          <MButton
            variant="contained"
            size="small"
            color="info"
            onClick={() => handleOpenPopup(TitlePopupHandle.CREATE_GROUP_ACCOUNT)}
          >
            <AddIcon /> Tạo nhóm
          </MButton>
          <Stack direction="row" spacing={2}>
            <MultiSelect
              title="Nhóm"
              options={[
                {
                  label: "Tất cả",
                  value: "all",
                },
                ...(newOptionUsersGroup || []),
              ]}
              onChange={(value: string | string[]) => setFilterGroup(value)}
              defaultValue={filterGroup}
              simpleSelect
              selectorId="group-user"
            />
            <MultiSelect
              title="Quyền"
              options={[
                {
                  label: "Tất cả",
                  value: "all",
                },
                ...rolesSlice.optionRole,
              ]}
              onChange={(value: string | string[]) => setFilterRole(value)}
              defaultValue={filterRole}
              simpleSelect={false}
              selectorId="role-options"
            />
            <TextField
              label="Nhập tên tài khoản"
              size="small"
              variant="standard"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={12} sx={{ p: 2 }}>
        <AttachGroup users={newDataUsers} usersGroup={newUsersGroup} />
      </Grid>
    </Grid>
  );
};

export default Group;
