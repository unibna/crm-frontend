import axios, { AxiosError } from "axios";
import { BaseResponseType } from "_types_/ResponseApiType";
import { FacebookType } from "_types_/FacebookType";
import { MultiResponseType } from "_types_/ResponseApiType";
import { formatParamsUtilMore } from "utils/formatParamsUtil";
import { APIConfig } from "_apis_";
import { ProductDTO } from "_types_/ProductType";
import { getAuthorizationHeaderFormData } from "_apis_";
import { ImageType } from "_types_/ImageFile";

const baseUrl = import.meta.env.REACT_APP_API_URL + "/api";
const keyFilter = [
  "category",
  "type",
  "variant_id",
  "reason",
  "sheet_type",
  "id",
  "dimensions",
  "dimentions",
  "warehouse",
  "reason_imports",
  "reason_exports",
  "reason_transfer",
];
let CancelToken = axios.CancelToken;

export const getId = async (params?: any, endPoint?: string) => {
  try {
    const cancelToken = params.cancelToken
      ? params.cancelToken
      : new CancelToken(function (cancel) {});
    delete params.cancelToken;

    const url = `/products/${endPoint}` + (params.id ? `${params.id}/` : "");
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

export const get = async <T>(params?: any, endPoint?: string) => {
  try {
    const cancelToken = params.cancelToken
      ? params.cancelToken
      : new CancelToken(function (cancel) {});
    delete params.cancelToken;

    const paramsUtil = formatParamsUtilMore(keyFilter, params);
    const result = await APIConfig(baseUrl).get<MultiResponseType<T>>(`/products/${endPoint}`, {
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

export const create = async (params?: any, endPoint?: string) => {
  try {
    const cancelToken = params.cancelToken
      ? params.cancelToken
      : new CancelToken(function (cancel) {});
    delete params.cancelToken;

    const result = await APIConfig(baseUrl).post<BaseResponseType<ProductDTO>>(
      `/products/${endPoint}`,
      { ...params },
      { cancelToken }
    );
    return result;
  } catch (error: any) {
    return {
      data: null,
      error: error?.response?.data,
    };
  }
};

export const update = async (params?: any, endPoint?: string) => {
  try {
    const cancelToken = params.cancelToken
      ? params.cancelToken
      : new CancelToken(function (cancel) {});
    delete params.cancelToken;

    const url = `/products/${endPoint}` + (params.id ? `${params.id}/` : "");
    delete params.id;
    const result = await APIConfig(baseUrl).patch<BaseResponseType<ProductDTO>>(
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
      error: error?.response?.data,
    };
  }
};

export const remove = async (params?: any, endPoint?: string) => {
  try {
    const url = `/products/${endPoint}` + (params.id ? `${params.id}/` : "");
    delete params.id;
    const result = await APIConfig(baseUrl).delete<BaseResponseType<FacebookType>>(url, {
      params,
    });

    return result;
  } catch (error) {
    return null;
  }
};

export const upload = async (params?: any, endPoint?: string) => {
  try {
    const formData = new FormData();
    formData.append("image", params);

    const headers = getAuthorizationHeaderFormData();

    const url = `/products/${endPoint}`;
    const result = await APIConfig(baseUrl).post<ImageType>(url, formData, { headers });

    return result;
  } catch (error) {
    return null;
  }
};

export const productApi = {
  update,
  remove,
  get,
  create,
  getId,
  upload,
};
