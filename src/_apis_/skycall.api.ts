import { APIConfig } from "_apis_";
import { BaseResponseType, MultiResponseType } from "_types_/ResponseApiType";
import { convertCancelToken, formatParamsUtilMore } from "utils/formatParamsUtil";

const baseUrl = import.meta.env.REACT_APP_CALL_CENTER_API + "/api";
const keyFilter: string[] = [
  "call_type",
  "call_status",
  "business_call_type",
  "telephonist_name",
  "modified_by_name",
  "dimension",
  "phone",
];

export const getId = async <T>({ params, endpoint = "" }: { params?: any; endpoint?: string }) => {
  try {
    const result = await APIConfig(baseUrl).get<BaseResponseType<T>>(`/${endpoint}`, {
      params,
    });
    return result;
  } catch (error) {
    return {
      data: null,
    };
  }
};

export const get = async <T>({ params, endpoint = "" }: { params?: any; endpoint?: string }) => {
  try {
    const { cancelToken, paramsNoneCancelToken } = convertCancelToken(params);
    const /* `paramsUtil` is a variable that stores the formatted parameters for the API request. It is
    created using the `formatParamsToURLUtil` function from the `formatParamsUtil` module.
    This function takes in the `keyFilter` array and the `paramsNoneCancelToken` object as
    arguments and formats the parameters into a URL-encoded string. This formatted string is
    then used as the `params` argument in the API request. */
      paramsUtil = formatParamsUtilMore(keyFilter, paramsNoneCancelToken);
    const result = await APIConfig(baseUrl).get<MultiResponseType<T>>(`/${endpoint}`, {
      params: paramsUtil,
      cancelToken,
    });
    return result;
  } catch (error: any) {
    return {
      data: null,
      error,
    };
  }
};

export const create = async <T>({ params, endpoint = "" }: { params?: any; endpoint?: string }) => {
  try {
    const result = await APIConfig(baseUrl).post<T>(`/${endpoint}`, params);
    return result;
  } catch (error: any) {
    return {
      data: null,
      error,
    };
  }
};

export const update = async <T>({ params, endpoint = "" }: { params?: any; endpoint?: string }) => {
  try {
    const result = await APIConfig(baseUrl).patch<T>(`/${endpoint}`, params);
    return result;
  } catch (error: any) {
    return {
      data: null,
      error,
    };
  }
};

export const remove = async <T>(endpoint?: string) => {
  try {
    const result = await APIConfig(baseUrl).delete<BaseResponseType<T>>(`/${endpoint}`);
    return { data: result.status };
  } catch (error) {
    return { data: null };
  }
};

export const skycallApi = {
  get,
  getId,
  create,
  update,
  remove,
};
