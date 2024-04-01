import { AxiosResponse } from "axios";
import { formatParamsUtilMore } from "utils/formatParamsUtil";
import { APIConfig } from "_apis_";
import { ShippingType } from "_types_/GHNType";
import {
  GHNBaseResponseType,
  GHNErrorResponseType,
  GHNMultiResponseType,
} from "_types_/ResponseGHNApi";

type FilterKeyType = keyof ShippingType;
const keyFilter: FilterKeyType[] = ["status", "payment_type_id"];

const endPoint = "/shiip/public-api";
const baseUrl = import.meta.env.REACT_APP_GHN_API_URL + endPoint;
const token = import.meta.env.REACT_APP_GHN_TOKEN;
const shopId = import.meta.env.REACT_APP_GHN_SHOP_ID;

const getMulti = async <T>({
  endpoint,
  params,
  token: tokenGhn,
}: {
  endpoint: string;
  params?: any;
  token?: string;
}): Promise<AxiosResponse<GHNMultiResponseType<T>> | GHNErrorResponseType> => {
  const paramsUtil = formatParamsUtilMore(keyFilter, params);
  try {
    const result = await APIConfig(baseUrl).get<GHNMultiResponseType<T>>(endpoint, {
      headers: { token: tokenGhn },
      params: paramsUtil,
    });
    return result;
  } catch (error: any) {
    return {
      data: null,
    };
  }
};

const getBase = async <T>({
  endpoint,
  params,
}: {
  endpoint: string;
  params?: any;
}): Promise<AxiosResponse<GHNBaseResponseType<T>> | GHNErrorResponseType> => {
  try {
    const result = await APIConfig(baseUrl).get<GHNBaseResponseType<T>>(endpoint, {
      headers: { token },
      params,
    });
    return result;
  } catch (error: any) {
    return {
      data: null,
    };
  }
};

const create = async <T>({
  body,
  endpoint,
  config,
}: {
  endpoint: string;
  body: any;
  config?: any;
}): Promise<AxiosResponse<GHNBaseResponseType<T>> | GHNErrorResponseType> => {
  try {
    const result = await APIConfig(baseUrl).post<GHNBaseResponseType<T>>(endpoint, body, {
      headers: { token, shop_id: shopId, ...config?.headers },
    });
    return result;
  } catch (error: any) {
    return { data: null };
  }
};

export const shippingApi = {
  getMulti,
  getBase,
  create,
};
