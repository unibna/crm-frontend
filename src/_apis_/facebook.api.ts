import { BaseResponseType, MultiResponseType } from "_types_/ResponseApiType";
import { FacebookType } from "_types_/FacebookType";
import { APIConfig } from "_apis_";
import { convertCancelToken, formatParamsUtilMore } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

export const keyFilter = [
  "product",
  "objective",
  "effective_status",
  "ad_account_id",
  "campaign_id",
  "adset_id",
  "content_creator",
  "content_designer",
  "digital_fb",
  "page_id",
  "dimension",
  "team",
];

const baseUrl = import.meta.env.REACT_APP_API_SYNC_DATA + "/api";

export const getId = async (paramsDefault?: any, endPoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

    const url = `/facebook/${endPoint}` + (params.id ? `${params.id}/` : "");
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

    const paramsUtil = formatParamsUtilMore(keyFilter, params);
    const result = await APIConfig(baseUrl).get<MultiResponseType<T>>(`/facebook/${endPoint}`, {
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

export const create = async (paramsDefault?: any, endPoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

    const result = await APIConfig(baseUrl).post<BaseResponseType<FacebookType>>(
      `/facebook/${endPoint}`,
      { ...params },
      { cancelToken }
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

    const url = `/facebook/${endPoint}` + (params.id ? `${params.id}/` : "");
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
    let message = "Đã có lỗi 500 ở server";
    if (error?.response?.status === 400) {
      if (getObjectPropSafely(() => error.response.data.__all__.length)) {
        message = error.response.data.__all__[0];
      } else {
        message =
          "Tính năng đồng bộ chỉ được bật chỉ khi tài khoản Facebook của page cũng được bật tính năng đồng bộ";
      }
    }
    return {
      message,
      data: null,
    };
  }
};

export const remove = async (params?: any, endPoint?: string) => {
  try {
    const url = `/facebook/${endPoint}` + (params.id ? `${params.id}/` : "");
    delete params.id;
    const result = await APIConfig(baseUrl).delete<BaseResponseType<FacebookType>>(url, {
      params,
    });

    return result;
  } catch (error) {
    return null;
  }
};

export const facebookApi = {
  update,
  remove,
  get,
  create,
  getId,
};
