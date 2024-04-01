import { BaseResponseType, MultiResponseType } from "_types_/ResponseApiType";
import { formatParamsToURLUtil} from "utils/formatParamsUtil";
import { APIConfig } from "_apis_";
import { store } from "store";
import { toastSuccess } from "store/redux/toast/slice";
import { RESPONSE_MESSAGES } from "assets/messages/response.messages";

export const keyFilter = ["tags"];

const baseUrl = import.meta.env.REACT_APP_API_URL + "/api";

export const getId = async <T>(params?: any, endPoint?: string) => {
  try {
    const result = await APIConfig(baseUrl).get<BaseResponseType<T>>(
      `/warehouse/${endPoint}` + (params.id ? `${params.id}/` : ""),
      {
        params,
      }
    );
    return result;
  } catch (error) {
    return {
      data: null,
    };
  }
};

export const get = async <T>(params?: any, endPoint?: string) => {
  try {
    const paramsUtil = formatParamsToURLUtil(keyFilter, params);
    const result = await APIConfig(baseUrl).get<MultiResponseType<T>>(`/warehouse/${endPoint}`, {
      params: paramsUtil,
    });
    return result;
  } catch (error: any) {
    return {
      data: null,
      error: error?.response,
    };
  }
};

export const create = async <T>(params?: any, endPoint?: string) => {
  try {
    const result = await APIConfig(baseUrl).post<T>(`/warehouse/${endPoint}`, params);
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.CREATE_SUCCESS }));
    return result;
  } catch (error: any) {
    return {
      data: null,
      error: error?.response,
    };
  }
};

export const update = async <T>(params?: any, endPoint?: string) => {
  try {
    const result = await APIConfig(baseUrl).patch<T>(`/warehouse/${endPoint}`, params);
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.UPDATE_SUCCESS }));
    return result;
  } catch (error: any) {
    return {
      data: null,
      error: error?.response,
    };
  }
};

export const removeById = async <T>(endPoint?: string) => {
  try {
    const result = await APIConfig(baseUrl).delete<BaseResponseType<T>>(`/warehouse/${endPoint}`);
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.DELETE_SUCCESS }));
    return { data: result.status };
  } catch (error) {
    return { data: null };
  }
};

export const warehouseApi = {
  update,
  removeById,
  get,
  create,
  getId,
};
