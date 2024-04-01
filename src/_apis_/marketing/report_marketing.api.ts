import { BaseResponseType } from "_types_/ResponseApiType";
import { FacebookType } from "_types_/FacebookType";
import { MultiResponseType } from "_types_/ResponseApiType";
import { APIConfig } from "_apis_";
import { convertCancelToken, formatParamsUtilMore } from "utils/formatParamsUtil";

export const keyFilter = [
  "objective",
  "phone_lead_status",
  "type",
  "effective_status",
  "campaign_id",
  "ad_group_id",
  "ad_account_id",
  "page_id",
  "content_creator",
  "team",
  "content_designer",
  "digital_fb",
  "digital_gg",
  "product",
  "customer_id",
  "product_name",
  "dimension",
  "cpa_ranking",
  "cpr_ranking",
  "kol_koc",
  "campaign_objective",
  "ads_type",
  "content_type",
  "status",
  "content",
  "channel",
  "selected_columns",
  "platform",
];

const baseUrl = import.meta.env.REACT_APP_REPORT_API + "/api";

export const getId = async (paramsDefault?: any, endPoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

    const result = await APIConfig(baseUrl).get<BaseResponseType<FacebookType>>(
      `/marketing/${endPoint}` + (params.id ? `${params.id}/` : ""),
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

export const get = async <T>(paramsDefault?: any, endPoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

    const paramsUtil = formatParamsUtilMore(keyFilter, params);

    const result = await APIConfig(baseUrl).get<MultiResponseType<T>>(`/marketing/${endPoint}`, {
      params: paramsUtil,
      cancelToken,
    });
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
      `/marketing/${endPoint}`,
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

export const update = async (paramsDefault?: any, endPoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

    const result = await APIConfig(baseUrl).patch<BaseResponseType<FacebookType>>(
      `/marketing/${endPoint}` + (params.id ? `${params.id}/` : ""),
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

export const remove = async (paramsDefault?: any, endPoint?: string) => {
  try {
    const result = await APIConfig(baseUrl).delete<BaseResponseType<FacebookType>>(
      `/marketing/${endPoint}` + (paramsDefault.id ? `${paramsDefault.id}/` : ""),
      {
        data: paramsDefault,
      }
    );
    return result;
  } catch (error) {
    return { data: null };
  }
};

export const reportMarketing = {
  update,
  remove,
  get,
  create,
  getId,
};
