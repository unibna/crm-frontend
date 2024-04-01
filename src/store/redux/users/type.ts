import { UserType } from "_types_/UserType";
//fetch user action
export const FETCH_ALL_USER = "users/fetchAllUser";
export const FETCH_ALL_USER_RES = "users/fetchAllUserRes";
export const CREATE_A_USER = "users/createUser";
export const CREATE_A_USER_RESPONSE = "users/createUserResponse";
export const UPDATE_A_USER = "users/updateUser";
export const UPDATE_A_USER_RESPONSE = "users/updateUserResponse";
export const DELETE_A_USER = "users/deleteUser";
export const DELETE_A_USER_RESPONSE = "users/deleteUserResponse";
export const GET_PROFILE = "users/getProfile";
export const GET_PROFILE_RESPONSE = "users/getProfileResponse";
export const SHOW_WELCOME_POPUP = "users/setShowWelcomePopup";

export type GetProfileAction = {
  type: typeof GET_PROFILE;
  payload: {
    isGetAllUser: boolean;
  };
};

export type GetProfileResponseAction = {
  type: typeof GET_PROFILE_RESPONSE;
  payload: {
    data: Partial<UserType> | null;
  };
};

export type CreateUserAction = {
  type: typeof CREATE_A_USER;
  body: Pick<UserType, "email" | "name" | "role" | "password" | "phone">;
};

export type CreateUserResponseAction = {
  type: typeof CREATE_A_USER_RESPONSE;
  payload: {
    data: UserType | null;
    message?: string;
  };
};

export type UpdateUserAction = {
  type: typeof UPDATE_A_USER;
  body: Partial<UserType> & { id: string };
};

export type UpdateUserResponseAction = {
  type: typeof UPDATE_A_USER_RESPONSE;
  payload: {
    data: Partial<UserType> | null;
    message?: string;
  };
};

export type DeleteUserAction = {
  type: typeof DELETE_A_USER;
  id: string;
};

export type DeleteUserResponseAction = {
  type: typeof DELETE_A_USER_RESPONSE;
  payload: {
    id: string | null;
    message?: string;
  };
};

export type FetchUserAction = {
  type: typeof FETCH_ALL_USER;
  params?: any;
};

export type FetchUserResponseAction = {
  type: typeof FETCH_ALL_USER_RES;
  payload: {
    users?: UserType[];
  };
};

export type UserActionType =
  | FetchUserAction
  | FetchUserResponseAction
  | DeleteUserAction
  | UpdateUserAction
  | CreateUserAction
  | CreateUserResponseAction
  | UpdateUserResponseAction
  | DeleteUserResponseAction;
