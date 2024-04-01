import { APIConfig, getAuthorizationHeaderFormData } from "_apis_";
import { ImageType } from "_types_/ImageFile";
import { BaseResponseType, MultiResponseType } from "_types_/ResponseApiType";
import { RESPONSE_MESSAGES } from "assets/messages/response.messages";
import { store } from "store";
import { toastError, toastSuccess } from "store/redux/toast/slice";
import { convertCancelToken, formatParamsUtilMore } from "utils/formatParamsUtil";

const baseUrl = import.meta.env.REACT_APP_API_URL + "/api";
export const keyFilter: string[] = [
  "status",
  "source",
  "delivery_company",
  "created_by",
  "tags",
  "type",
  "discount_method",
  "payment_type",
  "handle_by",
  "assign_by",
  "source",
  "carrier_status",
  "late_reason",
  "late_action",
  "wait_return_reason",
  "wait_return_action",
  "returning_reason",
  "returning_action",
  "returned_reason",
  "returned_action",
  "reasons_created",
  "shipping_carrier_status",
  "order_created_by",
  "shipping__carrier_status",
  "upload_by",
];

export const getId = async <T>({ endpoint, params }: { params?: any; endpoint?: string }) => {
  try {
    const result = await APIConfig(baseUrl).get<BaseResponseType<T>>(`/orders/${endpoint}`, {
      params,
    });
    return result;
  } catch (error: any) {
    return {
      data: null,
      error,
    };
  }
};

export const get = async <T>({ endpoint, params }: { params?: any; endpoint?: string }) => {
  const { cancelToken, paramsNoneCancelToken } = convertCancelToken(params);
  const paramsUtil = formatParamsUtilMore(keyFilter, paramsNoneCancelToken);
  try {
    const result = await APIConfig(baseUrl).get<MultiResponseType<T>>(`/orders/${endpoint}`, {
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

export const create = async <T>({
  endpoint,
  params,
  isShowToast = true,
}: {
  params?: any;
  endpoint?: string;
  isShowToast?: boolean;
}) => {
  try {
    const result = await APIConfig(baseUrl).post<T>(`/orders/${endpoint}`, params);
    isShowToast && store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.CREATE_SUCCESS }));

    return result;
  } catch (error) {
    return { data: null, error };
  }
};

export const update = async <T>({
  endpoint,
  params,
  optional,
}: {
  params?: any;
  endpoint?: string;
  optional?: any;
}) => {
  try {
    const result = await APIConfig(baseUrl).patch<T>(`/orders/${endpoint}`, params);
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.UPDATE_SUCCESS }));

    return result;
  } catch (error: any) {
    return {
      data: null,
      error: error?.response,
    };
  }
};

export const remove = async <T>({ endpoint }: { endpoint?: string }) => {
  try {
    const result = await APIConfig(baseUrl).delete<BaseResponseType<T>>(`/orders/${endpoint}`);
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.DELETE_SUCCESS }));

    return { data: result.status };
  } catch (error) {
    return { data: null };
  }
};

const removeById = async ({ endpoint, params }: { endpoint: string; params?: any }) => {
  try {
    await APIConfig(baseUrl).delete<BaseResponseType<any>>(`/orders/${endpoint}`, {
      ...params,
    });
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.DELETE_SUCCESS }));
    return { data: "success", code: 204 };
  } catch (error) {
    return { data: null };
  }
};

const upload = async (params?: any, endPoint?: string) => {
  try {
    const formData = new FormData();
    formData.append("file", params);

    const formDataHeaders = getAuthorizationHeaderFormData();
    const headers = { ...formDataHeaders };

    const url = `/orders/${endPoint}`;
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

export const orderApi = {
  get,
  getId,
  create,
  update,
  remove,
  removeById,
  upload,
};
