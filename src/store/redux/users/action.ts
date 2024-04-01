import { UserType } from "_types_/UserType";
import {
  FETCH_ALL_USER,
  FETCH_ALL_USER_RES,
  CREATE_A_USER_RESPONSE,
  DELETE_A_USER,
  CREATE_A_USER,
  DELETE_A_USER_RESPONSE,
  GET_PROFILE,
  GET_PROFILE_RESPONSE,
  UPDATE_A_USER,
  UPDATE_A_USER_RESPONSE,
  SHOW_WELCOME_POPUP,
  //-----------------
  CreateUserAction,
  CreateUserResponseAction,
  DeleteUserAction,
  DeleteUserResponseAction,
  FetchUserAction,
  FetchUserResponseAction,
  GetProfileAction,
  GetProfileResponseAction,
  UpdateUserAction,
  UpdateUserResponseAction,
} from "./type";

export const createUserAction = (
  body: Pick<UserType, "email" | "name" | "password" | "phone">
): CreateUserAction => {
  return {
    type: CREATE_A_USER,
    body,
  };
};

export const createUserResponseAction = (
  user: UserType | null,
  message?: string
): CreateUserResponseAction => {
  return {
    type: CREATE_A_USER_RESPONSE,
    payload: {
      data: user,
      message,
    },
  };
};

export const updateUserResponseAction = (
  user: UserType | null,
  message?: string
): UpdateUserResponseAction => {
  return {
    type: UPDATE_A_USER_RESPONSE,
    payload: {
      data: user,
      message,
    },
  };
};

export const updateUserAction = (
  body: Partial<UserType> & { id: string } & any
): UpdateUserAction => {
  return {
    type: UPDATE_A_USER,
    body,
  };
};

export const deleteUserAction = (id: string): DeleteUserAction => {
  return {
    type: DELETE_A_USER,
    id,
  };
};

export const deleteUserResponseAction = (
  id: string | null,
  message?: string
): DeleteUserResponseAction => {
  return {
    type: DELETE_A_USER_RESPONSE,
    payload: {
      id,
      message,
    },
  };
};

export const getAllUserAction = (params?: any): FetchUserAction => {
  return {
    type: FETCH_ALL_USER,
    params,
  };
};

export const getAllUserResponseAction = (users?: UserType[]): FetchUserResponseAction => {
  return {
    type: FETCH_ALL_USER_RES,
    payload: {
      users,
    },
  };
};

export const getProfileAction = (isGetAllUser: boolean): GetProfileAction => {
  return {
    type: GET_PROFILE,
    payload: {
      isGetAllUser,
    },
  };
};

export const showWelcomePopup = (
  payload: boolean
): { type: typeof SHOW_WELCOME_POPUP; payload: boolean } => {
  return {
    type: SHOW_WELCOME_POPUP,
    payload,
  };
};

export const getProfileResponseAction = (
  profile: Partial<UserType> | null
): GetProfileResponseAction => {
  return {
    type: GET_PROFILE_RESPONSE,
    payload: {
      data: profile,
    },
  };
};
