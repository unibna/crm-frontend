import { createSlice } from "@reduxjs/toolkit";
import { store } from "store";
import { userApi } from "_apis_/user.api";

export interface UserManualState {
  fetched: boolean;
  data: {
    isShow?: boolean;
    content?: string;
    code: string;
    created?: string;
    created_by?: any;
    modified?: string;
    modified_by?: any;
  }[];
}

const initialState: UserManualState = {
  fetched: false,
  data: [],
};

export const userManualSlice = createSlice({
  name: "usermanuals",
  initialState,
  reducers: {
    updateUserManual: (state, action) => {
      const { payload } = action;
      state = {
        ...state,
        ...payload,
      };
    },
  },
});

export default userManualSlice.reducer;

export const { updateUserManual } = userManualSlice.actions;

export const getAllUserManuals = async () => {
  const result: any = await userApi.get(
    {
      limit: 500,
      page: 1,
    },
    "user-department/"
  );

  if (result.data) {
    const { results = [] } = result.data;

    store.dispatch(updateUserManual(results));
  }
};

export const createUserManuals = async (
  payload: UserManualState["data"][number],
  list: UserManualState["data"],
  optional: any
) => {
  optional?.setLoading(true);
  const result = await userApi.create(payload, "user-department/");

  if (result.data) {
    store.dispatch(updateUserManual([...list, payload]));
  }

  optional?.setLoading(false);
};

export const updateUserManuals = async (
  payload: UserManualState["data"][number],
  list: UserManualState["data"],
  optional: any
) => {
  optional?.setLoading(true);
  const result = await userApi.update(payload, `user-department/${payload.code}/`);

  if (result.data) {
    const newData = list.map((item) => (item.code === payload.code ? payload : item));
    store.dispatch(updateUserManual(newData));
  }

  optional?.setLoading(false);
};

export const removeUserManuals = async (
  payload: { code: string },
  list: UserManualState["data"],
  optional?: any
) => {
  optional?.setLoading(true);
  const result = await userApi.remove(`user-department/${payload.code}/`);
  if (result?.status === 204) {
    const newData = list.filter((item: any) => item.code !== payload.code);
    store.dispatch(updateUserManual(newData));
  }

  optional?.setLoading(false);
};
