import { RESPONSE_MESSAGES } from "assets/messages/response.messages";
import { toastError, toastSuccess } from "store/redux/toast/slice";
import { dispatch, store } from "store";
import { APIConfig, getAuthorizationHeaderFormData } from "_apis_";
import { UserType } from "_types_/UserType";
import { convertCancelToken, formatParamsUtilMore } from "utils/formatParamsUtil";
import { ImageType } from "_types_/ImageFile";
import { BaseResponseType, MultiResponseType } from "_types_/ResponseApiType";
import { FacebookType } from "_types_/FacebookType";
import { handleResponseErrorMessage } from "utils/handleError";

const endPoint = "/api";
const baseUrl = import.meta.env.REACT_APP_API_URL + endPoint;
const keyFilter = ["group_permission", "department"];

const getAllUser = async ({ params }: { params?: any }) => {
  try {
    const paramsUtil = formatParamsUtilMore(keyFilter, params);

    const result = await APIConfig(baseUrl).get<{
      count: number;
      results: UserType[];
    }>("/users/", {
      params: paramsUtil,
    });

    return result;
  } catch (error) {
    return {
      message: "",
      data: [],
    };
  }
};

const createUser = async ({
  form,
}: {
  form: Pick<UserType, "email" | "name" | "role" | "password">;
}) => {
  try {
    const result = await APIConfig(baseUrl).post<UserType>("/users/", form);
    return { message: RESPONSE_MESSAGES.CREATE_SUCCESS, data: result.data };
  } catch (error: any) {
    return { data: null };
  }
};

const updateUser = async ({ id, form }: { id: string; form: Partial<UserType> }) => {
  try {
    const result = await APIConfig(baseUrl).patch<UserType>(`/users/${id}/`, form);
    return {
      data: result.data,
      message: RESPONSE_MESSAGES.UPDATE_SUCCESS,
    };
  } catch (error: any) {
    return { data: null };
  }
};

const deleteUser = async ({ id }: { id: string }) => {
  try {
    const result = await APIConfig(baseUrl).delete(`/users/${id}/`);
    return {
      data: result.status,
      message: RESPONSE_MESSAGES.DELETE_SUCCESS,
    };
  } catch (error) {
    return {
      data: null,
    };
  }
};

const getAllTelesalesUser = async ({ params }: { params?: any }) => {
  try {
    const result = await APIConfig(baseUrl).get<{
      count: number;
      results: UserType[];
    }>("/users/telesales/", {
      params: {
        ...params,
        limit: 1000,
      },
    });
    return { data: result.data.results, message: "" };
  } catch (error) {
    return {
      message: "",
      data: [],
    };
  }
};

const getRoles = async ({ params }: { params?: any }) => {
  try {
    const result = await APIConfig(baseUrl).get<{
      count: number;
      results: { id: number; name: string; data: any; route: string }[];
    }>("/users/permission/group/", { params });
    return { data: result.data.results, message: "" };
  } catch (error) {
    return {
      message: "",
      data: [],
    };
  }
};

const createRole = async ({ body }: { body: any }) => {
  try {
    const result = await APIConfig(baseUrl).post<{
      id: number;
      name: string;
      data: any;
      route: string;
    }>("/users/permission/group/", body);
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.CREATE_SUCCESS }));
    return { message: RESPONSE_MESSAGES.CREATE_SUCCESS, data: result.data };
  } catch (error: any) {
    return { data: null };
  }
};

const updateRole = async ({ id, body }: { id: number | string; body: any }) => {
  try {
    const result = await APIConfig(baseUrl).patch<{
      id: number;
      name: string;
      data: any;
      route: string;
    }>(`/users/permission/group/${id}`, body);
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.UPDATE_SUCCESS }));
    return { message: RESPONSE_MESSAGES.UPDATE_SUCCESS, data: result.data };
  } catch (error: any) {
    return { data: null };
  }
};

export const upload = async (params?: any, endPoint?: string) => {
  try {
    const formData = new FormData();
    formData.append("image", params);

    const headers = getAuthorizationHeaderFormData();

    const url = `/users/${endPoint}`;
    const result = await APIConfig(baseUrl).post<ImageType>(url, formData, { headers });

    return result;
  } catch (error) {
    return null;
  }
};

export const create = async (paramsDefault?: any, endPoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

    const result = await APIConfig(baseUrl).post<BaseResponseType<FacebookType>>(
      `/users/${endPoint}`,
      params,
      { cancelToken }
    );
    return result;
  } catch (error) {
    return {
      data: null,
    };
  }
};

export const get = async <T>(paramsDefault?: any, endPoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

    delete params.cancelToken;

    const paramsUtil = formatParamsUtilMore(keyFilter, params);

    const result = await APIConfig(baseUrl).get<MultiResponseType<T>>(`/users/${endPoint}`, {
      params: paramsUtil,
      cancelToken,
    });
    return result;
  } catch (error) {
    return {
      data: null,
    };
  }
};

export const update = async <T>(paramsDefault?: any, endPoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

    const result = await APIConfig(baseUrl).patch<T>(`/users/${endPoint}`, params, { cancelToken });
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.UPDATE_SUCCESS }));
    return result;
  } catch (error) {
    return {
      data: null,
    };
  }
};

export const remove = async (endPoint?: string) => {
  try {
    const url = `/users/${endPoint}`;
    const result = await APIConfig(baseUrl).delete<BaseResponseType<FacebookType>>(url);
    return result;
  } catch (error) {
    return null;
  }
};

export const userApi = {
  getAllUser,
  createUser,
  updateUser,
  deleteUser,
  getAllTelesalesUser,
  getRoles,
  createRole,
  updateRole,
  upload,
  create,
  get,
  update,
  remove,
};
