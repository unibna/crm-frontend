import { BaseResponseType } from "_types_/ResponseApiType";
import { FacebookType } from "_types_/FacebookType";
import { MultiResponseType } from "_types_/ResponseApiType";
import { APIConfig } from "_apis_";
import { formatParamsUtilMore } from "utils/formatParamsUtil";
import axios from 'axios';

export const keyFilter = [
];

const baseUrl = import.meta.env.REACT_APP_REPORT_API + "/api";
let CancelToken = axios.CancelToken;

export const getId = async (params?: any, endPoint?: string) => {
  try {
    const cancelToken = params.cancelToken ? params.cancelToken : new CancelToken(function () { });
    delete params.cancelToken;

    const result = await APIConfig(baseUrl).get<BaseResponseType<FacebookType>>(
      `/airtable/${endPoint}` + (params.id ? `${params.id}/` : ""),
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

export const get = async <T>(params?: any, endPoint?: string) => {
  try {
    const cancelToken = params.cancelToken ? params.cancelToken : new CancelToken(function () { });
    delete params.cancelToken;

    const paramsUtil = formatParamsUtilMore(keyFilter, params);
    const result = await APIConfig(baseUrl).get<MultiResponseType<T>>(
      `/airtable/${endPoint}`,
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

export const create = async (params?: any, endPoint?: string) => {
  try {
    const cancelToken = params.cancelToken ? params.cancelToken : new CancelToken(function () { });
    delete params.cancelToken;

    const result = await APIConfig(baseUrl).post<BaseResponseType<FacebookType>>(
      `/airtable/${endPoint}`,
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

export const update = async (params?: any, endPoint?: string) => {
  try {
    const result = await APIConfig(baseUrl).patch<BaseResponseType<FacebookType>>(
      `/airtable/${endPoint}` + (params.id ? `${params.id}/` : ""),
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
      `/airtable/${endPoint}` + (params.id ? `${params.id}/` : ""),
      {
        data: params,
      }
    );
    return result;
  } catch (error) {
    return { data: null };
  }
};

export const airtableMarketingApi = {
  update,
  remove,
  get,
  create,
  getId,
};
