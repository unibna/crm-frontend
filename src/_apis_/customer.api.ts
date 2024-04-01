import { convertCancelToken, formatParamsToURLUtil } from "utils/formatParamsUtil";
import { APIConfig } from "_apis_";
import { BaseResponseType, MultiResponseType } from "_types_/ResponseApiType";
import { getAuthorizationHeaderFormData } from "./index";
import { ImageType } from "_types_/ImageFile";
import { store } from "store";
import { toastSuccess } from "store/redux/toast/slice";
import { RESPONSE_MESSAGES } from "assets/messages/response.messages";
import { CustomerType } from "_types_/CustomerType";

const endPoint = "/api";
const baseUrl = import.meta.env.REACT_APP_API_URL + endPoint;

export const keyFilter = ["created_by", "tags", "ranking"];

//phone lead
const get = async <T = CustomerType>({ endpoint, params }: { endpoint: string; params?: any }) => {
  const { cancelToken, paramsNoneCancelToken } = convertCancelToken(params);

  const paramsURL = formatParamsToURLUtil(keyFilter, paramsNoneCancelToken);
  try {
    const result = await APIConfig(baseUrl).get<MultiResponseType<T>>(`/customers/${endpoint}`, {
      params: paramsURL,
      cancelToken,
    });
    return result;
  } catch (error: any) {
    return { data: null, error };
  }
};

export const getById = async <T = CustomerType>({
  params,
  endpoint,
}: {
  params?: any;
  endpoint?: string;
}) => {
  try {
    const result = await APIConfig(baseUrl).get<T>(`/customers/${endpoint}`, {
      params,
    });
    return result;
  } catch (error) {
    return { data: null, error };
  }
};

export const create = async <T = CustomerType>({
  params,
  endpoint,
}: {
  params?: any;
  endpoint?: string;
}) => {
  try {
    const result = await APIConfig(baseUrl).post<T>(`/customers/${endpoint}`, params);
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.CREATE_SUCCESS }));
    return result;
  } catch (error: any) {
    return { data: null, error };
  }
};

export const update = async <T = CustomerType>({
  params,
  endpoint,
}: {
  endpoint: string;
  params?: any;
}) => {
  try {
    const result = await APIConfig(baseUrl).patch<T>(`/customers/${endpoint}`, {
      ...params,
    });
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.UPDATE_SUCCESS }));
    return result;
  } catch (error) {
    return { data: null, error };
  }
};

export const uploadFile = async ({ file }: { file: any }) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const headers = getAuthorizationHeaderFormData();
    const result = await APIConfig(baseUrl).post<ImageType>(
      `/customers/uploads/images/`,
      formData,
      { headers }
    );
    return result;
  } catch (error) {
    return { data: null, error };
  }
};

const removeFileById = async ({ id, params }: { id: string; params?: any }) => {
  try {
    await APIConfig(baseUrl).delete<BaseResponseType<any>>(`/customers/uploads/images/${id}/`, {
      ...params,
    });
    return { data: "success", code: 204 };
  } catch (error) {
    return { data: null, error };
  }
};

const removeById = async ({ endpoint, params }: { endpoint: string; params?: any }) => {
  try {
    await APIConfig(baseUrl).delete<BaseResponseType<any>>(`/customers/${endpoint}`, {
      ...params,
    });
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.DELETE_SUCCESS }));
    return { data: "success", code: 204 };
  } catch (error) {
    return { data: null, error };
  }
};

export const customerApi = {
  get,
  getById,
  create,
  update,
  uploadFile,
  removeFileById,
  removeById,
};
