import { APIConfig, getAuthorizationHeaderFormData } from "_apis_";
import { FacebookType } from "_types_/FacebookType";
import { ImageType } from "_types_/ImageFile";
import { ProductDTO } from "_types_/ProductType";
import { BaseResponseType, MultiResponseType } from "_types_/ResponseApiType";
import { RESPONSE_MESSAGES } from "assets/messages/response.messages";
import { store } from "store";
import { toastError } from "store/redux/toast/slice";
import { convertCancelToken, formatParamsUtilMore } from "utils/formatParamsUtil";

const baseUrl = import.meta.env.REACT_APP_SKYCOM_API;
const ORGANIZATION_ID = import.meta.env.REACT_APP_ORGANIZATION_ID;

const keyFilter: string[] = [];

export const getId = async (paramsDefault?: any, endPoint?: string) => {
  try {
    const { cancelToken, paramsNoneCancelToken: params } = convertCancelToken(paramsDefault);

    const url = `/skytable/${endPoint}` + (params.id ? `${params.id}/` : "");
    delete params.id;
    const result = await APIConfig(baseUrl, {
      headers: { "x-organization-id": ORGANIZATION_ID },
    }).get<BaseResponseType<FacebookType>>(url, {
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
    const result = await APIConfig(baseUrl, {
      headers: { "x-organization-id": ORGANIZATION_ID },
    }).get<MultiResponseType<T>>(`/skytable/${endPoint}`, {
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

    const result = await APIConfig(baseUrl, {
      headers: { "x-organization-id": ORGANIZATION_ID },
    }).post<BaseResponseType<ProductDTO>>(
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

    const url = `/skytable/${endPoint}`;
    // delete params.id;
    const result = await APIConfig(baseUrl, {
      headers: { "x-organization-id": ORGANIZATION_ID },
    }).put<BaseResponseType<ProductDTO>>(
      url,
      Array.isArray(params)
        ? params
        : {
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
    const result = await APIConfig(baseUrl, {
      headers: { "x-organization-id": ORGANIZATION_ID },
    }).delete<BaseResponseType<FacebookType>>(url, {
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
    formData.append("file", params);

    const formDataHeaders = getAuthorizationHeaderFormData();
    const headers = { ...formDataHeaders, "x-organization-id": ORGANIZATION_ID };

    const url = `/skytable/${endPoint}`;
    const result = await APIConfig(baseUrl, {
      headers,
    }).post<ImageType>(url, formData, {
      headers,
    });

    return result;
  } catch (error: any) {
    if (error?.response?.status === 413)
      store.dispatch(toastError({ message: RESPONSE_MESSAGES.TOO_LARGE_FILE_SIZE }));
    return null;
  }
};

export const skycomtableApi: any = {
  update,
  remove,
  get,
  create,
  getId,
  upload,
};
