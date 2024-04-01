import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { createSlice } from "@reduxjs/toolkit";
import { RootState, store } from "store";
import { userApi } from "_apis_/user.api";
import map from "lodash/map";
import { WritableDraft } from "immer/dist/types/types-external";
import { fetchAllUsersGroup } from "store/redux/users/slice";

export interface RoleState {
  roles: {
    [key: string]: any;
  };
  optionRole: { label: string; value: string; route: string }[];
  listRoles: { id: string; name: string; route: string; data: any }[];
  loading: boolean;
  error: boolean;
}

const initialState: RoleState = {
  roles: {},
  optionRole: [],
  listRoles: [],
  loading: false,
  error: false,
};

export const rolesSlice = createSlice({
  name: "roles",
  initialState,
  // The reducers field lets us define reducers and generate associated actions
  reducers: {
    setRoles: (state: WritableDraft<RoleState>, action: any) => {
      state.roles = action.payload;
      state.listRoles = Object.values(action.payload);
    },
    createRoleSuccess: (state: WritableDraft<RoleState>, action: any) => {
      state.roles = { ...state.roles, ...action.payload };

      const id = Object.keys(action.payload)[0];
      state.listRoles = [
        ...state.listRoles.filter((item) => +item.id !== +id),
        { ...action.payload?.[id] },
      ];
    },
    updateRoleSuccess: (state: WritableDraft<RoleState>, action: any) => {
      state.roles = { ...state.roles, ...action.payload };

      const id = Object.keys(action.payload)[0];
      state.listRoles = [
        ...state.listRoles.filter((item) => +item.id !== +id),
        { ...action.payload?.[id] },
      ];
    },
    setOptionRole: (state: WritableDraft<RoleState>, action: any) => {
      state.optionRole = action.payload;
    },
    createOptionRoleSuccess: (state: WritableDraft<RoleState>, action: any) => {
      state.optionRole = [...state.optionRole, action.payload];
    },
    updateOptionRoleSuccess: (state: WritableDraft<RoleState>, action: any) => {
      const itemIndex = state.optionRole.findIndex((item) => item.value === action.payload.value);
      if (itemIndex) {
        state.optionRole.splice(itemIndex, 1, action.payload);
      }
    },
  },
});

export const rolesStore = (state: RootState) => state.roles;
export default rolesSlice.reducer;
export const {
  setRoles,
  setOptionRole,
  createOptionRoleSuccess,
  createRoleSuccess,
  updateRoleSuccess,
  updateOptionRoleSuccess,
} = rolesSlice.actions;

export const createRoleAction = async ({
  name,
  data,
  route,
  code,
}: {
  name: string;
  data: any;
  route: string | null;
  code: string;
}) => {
  const result = await userApi.createRole({ body: { name, data, route, code } });
  if (result.data) {
    const { id, name, data, route } = result.data;
    store.dispatch(createOptionRoleSuccess({ label: name, value: id.toString(), route }));
    store.dispatch(createRoleSuccess({ [id]: { data, route, name, id } }));
  }
};

export const updateRoleAction = async ({
  name,
  data,
  id,
  route,
}: {
  id: string | number;
  name: string;
  data: any;
  route: string | null;
}) => {
  const result = await userApi.updateRole({ id, body: { name, data, route } });
  if (result.data) {
    const { id, name, data, route } = result.data;
    store.dispatch(updateOptionRoleSuccess({ label: name, value: id.toString() }));
    store.dispatch(updateRoleSuccess({ [id]: { data, route, name, id } }));
  }
};

export const getRolesAction = async () => {
  const result = await userApi.getRoles({ params: { limit: 1000 } });
  if (result.data) {
    const optionsRole = map(result.data, (item: { id: number; name: string; data: any }) => ({
      label: item.name,
      value: item.id.toString(),
    }));
    let rolesFormat: any = {};
    map(result.data, (item: { id: number; name: string; data: any; route: string | null }) => {
      rolesFormat[item.id] = { data: item.data, route: item.route, name: item.name, id: item.id };
      return;
    });

    store.dispatch(setOptionRole(optionsRole));
    store.dispatch(setRoles(rolesFormat));
  }
};

export const getAllUsersGroup = async () => {
  const result = await userApi.get({}, "user-group/");
  if (result.data) {
    const { results } = result.data;
    const newData = map(results, (item: any) => ({
      ...item,
      value: item.id,
      label: item.name,
      color: getObjectPropSafely(() => item.extra.color) || "",
    }));

    store.dispatch(fetchAllUsersGroup(newData));
  }
};
