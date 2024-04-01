import { BaseResponseType } from "_types_/ResponseApiType";
import { FacebookType } from "_types_/FacebookType";
import { MultiResponseType } from "_types_/ResponseApiType";
import { APIConfig } from "_apis_";
import { convertCancelToken, formatParamsUtilMore } from "utils/formatParamsUtil";

export const keyFilter = [
  "lead_status",
  "handle_by",
  "channel",
  "product",
  "fanpage",
  "handle_status",
  "fail_reason",
  "data_status",
  "created_by",
  "bad_data_reason",
  "objective",
  "effective_status",
  "ad_account_id",
  "campaign_id",
  "adset_id",
  "effective_status",
  "content_creator",
  "content_designer",
  "digital_fb",
  "product",
  "digital_gg",
  "page_id",
  "post_type",
  "customer_id",
  "ad_group_id",
  "dimension",
  "skylink_status",
  "referring_site",
  "source_name",
  "handle_reason",
  "landing_page_domain",
  "tags",
];

const baseUrl = import.meta.env.REACT_APP_URL_DATA + "/api";

export const getId = async (paramsDefault?: any, endPoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

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

export const get = async <T>(paramsDefault?: any, endPoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

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

export const create = async (paramsDefault?: any, endPoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

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

export const update = async (paramsDefault?: any, endPoint?: string) => {
  try {
    const result = await APIConfig(baseUrl).patch<BaseResponseType<FacebookType>>(
      `/airtable/${endPoint}` + (paramsDefault.id ? `${paramsDefault.id}/` : ""),
      paramsDefault
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
      `/airtable/${endPoint}` + (paramsDefault.id ? `${paramsDefault.id}/` : ""),
      {
        data: paramsDefault,
      }
    );
    return result;
  } catch (error) {
    return { data: null };
  }
};

export const airtableApi = {
  update,
  remove,
  get,
  create,
  getId,
};
