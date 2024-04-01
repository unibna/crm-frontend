import { BaseResponseType, MultiResponseType } from "_types_/ResponseApiType";
import { APIConfig } from "_apis_";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { convertCancelToken } from "utils/formatParamsUtil";

const baseUrl = import.meta.env.REACT_APP_API_SYNC_DATA + "/api";

export const get = async <T>({ endpoint, params }: { params?: any; endpoint: string }) => {
  try {
    const { cancelToken, paramsNoneCancelToken } = convertCancelToken(params);

    const result = await APIConfig(baseUrl).get<MultiResponseType<T>>(`/spam_check/${endpoint}`, {
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

    const result = await APIConfig(baseUrl).get<BaseResponseType<T>>(`/spam_check/${endpoint}`, {
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
      `/spam_check/${endpoint}`,
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

    const url = `/spam_check/${endpoint}`;
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

export const remove = async <T>({ endpoint, data = {} }: { data?: any; endpoint?: string }) => {
  try {
    const url = `/spam_check/${endpoint}`;
    delete data.id;
    const result = await APIConfig(baseUrl).delete<BaseResponseType<T>>(url, {
      data,
    });

    return result;
  } catch (error) {
    return null;
  }
};

export const interceptApi = {
  get,
  getById,
  create,
  update,
  remove,
};
