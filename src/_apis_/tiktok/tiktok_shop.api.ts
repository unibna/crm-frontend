import { BaseResponseType } from "_types_/ResponseApiType";
import { FacebookType } from "_types_/FacebookType";
import { MultiResponseType } from "_types_/ResponseApiType";
import { convertCancelToken, formatParamsUtilMore } from "utils/formatParamsUtil";
import { APIConfig } from "_apis_";

export const keyFilter = [];

const baseUrl = import.meta.env.REACT_APP_SKYCOM_API;
const ORGANIZATION_ID = import.meta.env.REACT_APP_ORGANIZATION_ID;

export const getId = async (paramsDefault?: any, endPoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

    const url = `/tiktok-shop/${endPoint}` + (params.id ? `${params.id}/` : "");
    delete params.id;
    const result = await APIConfig(baseUrl).get<BaseResponseType<FacebookType>>(url, {
      params,
      cancelToken,
    });
    return result;
  } catch (error) {
    return {
      message: "Đã có lỗi xảy ra",
      data: null,
    };
  }
};

export const get = async <T>(paramsDefault?: any, endPoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);
    delete params.headers;

    const paramsUtil = formatParamsUtilMore(keyFilter, params);
    const result = await APIConfig(baseUrl).get<MultiResponseType<T>>(`/tiktok-shop/${endPoint}`, {
      params: paramsUtil,
      headers: { "x-organization-id": ORGANIZATION_ID },
      cancelToken,
    });
    return result;
  } catch (error) {
    return {
      data: null,
    };
  }
};

export const create = async <T = FacebookType>(paramsDefault?: any, endPoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

    const result = await APIConfig(baseUrl).post<BaseResponseType<T>>(
      `/tiktok-shop/${endPoint}`,
      { ...params },
      { cancelToken, headers: { "x-organization-id": ORGANIZATION_ID } }
    );
    return result;
  } catch (error) {
    return {
      data: null,
    };
  }
};

export const update = async (paramsDefault?: any, endPoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

    const url = `/tiktok-shop/${endPoint}` + (params.id ? `${params.id}/` : "");
    delete params.id;
    const result = await APIConfig(baseUrl).patch<BaseResponseType<FacebookType>>(
      url,
      {
        ...params,
      },
      { cancelToken }
    );

    return result;
  } catch (error: any) {
    return {
      data: null,
      error: error?.response,
    };
  }
};

export const remove = async (params?: any, endPoint?: string) => {
  try {
    const url = `/tiktok-shop/${endPoint}` + (params.id ? `${params.id}/` : "");
    delete params.id;
    const result = await APIConfig(baseUrl).delete<BaseResponseType<FacebookType>>(url, {
      params,
    });

    return result;
  } catch (error) {
    return null;
  }
};

export const tiktokApi = {
  update,
  remove,
  get,
  create,
  getId,
};
