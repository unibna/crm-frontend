import { BaseResponseType } from "_types_/ResponseApiType";
import { FacebookType } from "_types_/FacebookType";
import { MultiResponseType } from "_types_/ResponseApiType";
import { convertCancelToken, formatParamsUtilMore } from "utils/formatParamsUtil";
import { APIConfig } from "_apis_";
import { ProductDTO } from "_types_/ProductType";
import { getAuthorizationHeaderFormData } from "_apis_";
import { ImageType } from "_types_/ImageFile";

const baseUrl = import.meta.env.REACT_APP_API_URL + "/api";
const keyFilter = [
  "status",
  "handle_by",
  "channel",
  "product",
  "handle_reason",
  "solution",
  "comment",
  "solution_description",
  "manager",
  "type",
  "viewer_group_user",
  "viewer_user",
  "view_group",
];

export const getId = async (paramsDefault?: any, endPoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

    const url = `/skytable/${endPoint}` + (params.id ? `${params.id}/` : "");
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
    const result = await APIConfig(baseUrl).get<MultiResponseType<T>>(
      `/skytable/${endPoint}`,
      {
        params: paramsUtil,
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

export const create = async (paramsDefault?: any, endPoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

    const result = await APIConfig(baseUrl).post<BaseResponseType<ProductDTO>>(
      `/skytable/${endPoint}`,
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

export const update = async (paramsDefault?: any, endPoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

    const url = `/skytable/${endPoint}` + (params.id ? `${params.id}/` : "");
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
    const url = `/skytable/${endPoint}` + (params.id ? `${params.id}/` : "");
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

    const url = `/skytable/${endPoint}`;
    const result = await APIConfig(baseUrl).post<ImageType>(url, formData, { headers });

    return result;
  } catch (error) {
    return null;
  }
};

export const skytableApi = {
  update,
  remove,
  get,
  create,
  getId,
  upload,
};
