import { BaseResponseType } from "_types_/ResponseApiType";
import { FacebookType } from "_types_/FacebookType";
import { MultiResponseType } from "_types_/ResponseApiType";
import { APIConfig } from "_apis_";
import { convertCancelToken, formatParamsUtilMore } from "utils/formatParamsUtil";

export const keyFilter = [
  "carrier_status",
  "delivery_company",
  "delivery_company_type",
  "order_source"
];

const baseUrl = import.meta.env.REACT_APP_API_URL + "/api";

export const getId = async (paramsDefault?: any, endPoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

    const result = await APIConfig(baseUrl).get<BaseResponseType<FacebookType>>(
      `/delivery/${endPoint}` + (params.id ? `${params.id}/` : ""),
      {
        params,
        cancelToken
      }
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

    const paramsUtil = formatParamsUtilMore(keyFilter, params);
    const result = await APIConfig(baseUrl).get<MultiResponseType<T>>(
      `/delivery/${endPoint}`,
      {
        params: paramsUtil,
        cancelToken
      }
    );
    return result;
  } catch (error) {
    return {
      data: null,
    };
  }
};

export const create = async (paramsDefault?: any, endPoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

    const result = await APIConfig(baseUrl).post<BaseResponseType<FacebookType>>(
      `/delivery/${endPoint}`,
      params,
      { cancelToken }
    );
    return result;
  } catch (error: any) {
    return {
      data: null,
      error: error.response.data
    };
  }
};

export const update = async (params?: any, endPoint?: string) => {
  try {
    const result = await APIConfig(baseUrl).patch<BaseResponseType<FacebookType>>(
      `/delivery/${endPoint}` + (params.id ? `${params.id}/` : ""),
      params
    );
    return result;
  } catch (error) {
    return {
      data: null,
    };
  }
};

export const remove = async (params?: any, endPoint?: string) => {
  try {
    const result = await APIConfig(baseUrl).delete<BaseResponseType<FacebookType>>(
      `/delivery/${endPoint}` + (params.id ? `${params.id}/` : ""),
      {
        data: params,
      }
    );
    return result;
  } catch (error) {
    return { data: null };
  }
};

export const deliveryApi = {
  update,
  remove,
  get,
  create,
  getId,
};
