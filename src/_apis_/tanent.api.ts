import { APIConfig } from "_apis_";
import { FacebookType } from "_types_/FacebookType";
import { BaseResponseType, MultiResponseType } from "_types_/ResponseApiType";
import { convertCancelToken } from "utils/formatParamsUtil";

const baseUrl = import.meta.env.REACT_APP_API_SYNC_DATA + "/api";

const getTenant = async <T>({ params, endpoint = "" }: { params?: any; endpoint?: string }) => {
  const { cancelToken } = convertCancelToken(params);

  try {
    const result = await APIConfig(baseUrl).get<MultiResponseType<T>>(`/core/${endpoint}`, {
      params,
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

const createTenant = async (params?: any, endpoint?: string) => {
  const { paramsNoneCancelToken: _params } = convertCancelToken(params);

  try {
    const result = await APIConfig(baseUrl).post<BaseResponseType<FacebookType>>(
      `/core/${endpoint}`,
      {
        ...params,
      }
    );
    return result;
  } catch (error: any) {
    return {
      data: null,
      error,
    };
  }
};

const deleteTenant = async (params?: any, endpoint?: string) => {
  const { cancelToken, paramsNoneCancelToken: _params } = convertCancelToken(params);

  try {
    const result = await APIConfig(baseUrl).delete<BaseResponseType<FacebookType>>(
      `/core/${endpoint}`,
      {
        cancelToken,
      }
    );
    return result;
  } catch (error: any) {
    return {
      data: null,
      error,
    };
  }
};

export const tanentApi = {
  getTenant,
  createTenant,
  deleteTenant,
};
