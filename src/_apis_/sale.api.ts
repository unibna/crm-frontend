import { BaseResponseType } from "_types_/ResponseApiType";
import { FacebookType } from "_types_/FacebookType";
import { MultiResponseType } from "_types_/ResponseApiType";
import { convertCancelToken, formatParamsUtilMore } from "utils/formatParamsUtil";
import { APIConfig } from "_apis_";

export const keyFilter = [
  "product",
  "objective",
  "effective_status",
  "campaign_id",
  "content_creator",
  "content_designer",
  "team",
  "digital_gg",
  "customer_id",
  "ad_group_id",
  "dimension",
  "handle_by",
  "created_by",
  "channel",
  "landing_page_domain",
  "fanpage",
  "handle_status",
  "handle_reason",
  "bad_data_reason",
  "fail_reason",
  "data_status",
  "lead_channel",
  "lead_product",
];

const baseUrl = import.meta.env.REACT_APP_REPORT_API + "/api";
export const getId = async (paramsDefault?: any, endpoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

    const result = await APIConfig(baseUrl).get<BaseResponseType<FacebookType>>(
      `sale/${endpoint}` + (params.id ? `${params.id}/` : ""),
      {
        params,
        cancelToken,
      }
    );
    return result;
  } catch (error) {
    return {
      data: null,
    };
  }
};

export const get = async <T>(paramsDefault?: any, endpoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

    const paramsUtil = formatParamsUtilMore(keyFilter, params);

    const result = await APIConfig(baseUrl).get<MultiResponseType<T>>(`sale/${endpoint}`, {
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

export const create = async (paramsDefault?: any, endpoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

    const result = await APIConfig(baseUrl).post<BaseResponseType<FacebookType>>(
      `sale/${endpoint}`,
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

export const update = async (paramsDefault?: any, endpoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

    const result = await APIConfig(baseUrl).patch<BaseResponseType<FacebookType>>(
      `sale/${endpoint}` + (params.id ? `${params.id}/` : ""),
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

export const remove = async (params?: any, endpoint?: string) => {
  try {
    const result = await APIConfig(baseUrl).delete<BaseResponseType<FacebookType>>(
      `sale/${endpoint}` + (params.id ? `${params.id}/` : ""),
      {
        data: params,
      }
    );
    return result;
  } catch (error) {
    return { data: null };
  }
};

export const saleApi = {
  update,
  remove,
  get,
  create,
  getId,
};
