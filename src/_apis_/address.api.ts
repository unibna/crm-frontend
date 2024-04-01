import { BaseResponseType, MultiResponseType } from "_types_/ResponseApiType";
import { APIConfig } from "_apis_";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { convertCancelToken } from "utils/formatParamsUtil";

const baseUrl = import.meta.env.REACT_APP_API_URL + "/api";

export const get = async <T>({ endpoint, params }: { params?: any; endpoint: string }) => {
  try {
    const { cancelToken, paramsNoneCancelToken } = convertCancelToken(params);

    const result = await APIConfig(baseUrl).get<MultiResponseType<T>>(`/locations/${endpoint}`, {
      params: paramsNoneCancelToken,
      cancelToken,
    });
    return result;
  } catch (error) {
    return {
      data: null,
    };
  }
};

export const getById = async <T>({ endpoint, params }: { params?: any; endpoint: string }) => {
  try {
    const { cancelToken, paramsNoneCancelToken } = convertCancelToken(params);

    const result = await APIConfig(baseUrl).get<BaseResponseType<T>>(`/locations/${endpoint}`, {
      params: paramsNoneCancelToken,
      cancelToken,
    });
    return result;
  } catch (error) {
    return {
      data: null,
    };
  }
};

export const create = async <T>(params?: any, endpoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken } = convertCancelToken(params);

    const result = await APIConfig(baseUrl).post<T>(
      `/locations/${endpoint}`,
      {
        ...paramsNoneCancelToken,
      },
      { cancelToken }
    );
    return result;
  } catch (error) {
    return {
      data: null,
    };
  }
};

export const update = async <T>({ endpoint, params }: { params?: any; endpoint?: string }) => {
  try {
    const { cancelToken, paramsNoneCancelToken } = convertCancelToken(params);

    const url =
      `/locations/${endpoint}` + (paramsNoneCancelToken.id ? `${paramsNoneCancelToken.id}` : "");
    delete paramsNoneCancelToken.id;
    const result = await APIConfig(baseUrl).patch<BaseResponseType<T>>(
      url,
      {
        ...paramsNoneCancelToken,
      },
      { cancelToken }
    );

    return result;
  } catch (error: any) {
    let message = "Đã có lỗi 500 ở server";
    if (error?.response?.status === 400) {
      if (getObjectPropSafely(() => error.response.data.__all__.length)) {
        message = error.response.data.__all__[0];
      }
    }
    return {
      message,
      data: null,
    };
  }
};

export const remove = async <T>({ endpoint, params }: { params?: any; endpoint?: string }) => {
  try {
    const url = `/locations/${endpoint}` + (params.id ? `${params.id}` : "");
    delete params.id;
    const result = await APIConfig(baseUrl).delete<BaseResponseType<T>>(url, {
      params,
    });

    return result;
  } catch (error) {
    return null;
  }
};

export const addressApi = {
  get,
  getById,
  create,
  update,
  remove,
};
