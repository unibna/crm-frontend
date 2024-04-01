import { APIConfig } from "_apis_";
import { AttributeType } from "_types_/AttributeType";
import {
  PhoneLeadAttributeType,
  PhoneLeadReportType,
  PhoneLeadResType,
  PhoneLogInfoType,
} from "_types_/PhoneLeadType";
import { MultiResponseType } from "_types_/ResponseApiType";
import { SaleOnlineDailyType } from "_types_/UserType";
import { RESPONSE_MESSAGES } from "assets/messages/response.messages";
import { store } from "store";
import { toastSuccess } from "store/redux/toast/slice";
import { convertCancelToken, formatParamsToURLUtil } from "utils/formatParamsUtil";
import { InterceptType } from "views/LeadCenterView/components/InterceptContainer";
import recude from "lodash/reduce";

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
  "tags",
  "ad_channel",
];

const endPoint = "/api";
const baseUrl = import.meta.env.REACT_APP_API_URL + endPoint;

const sortAttributes = (atts: AttributeType[] = []) => {
  return atts.sort((a, b) => parseInt(b.id.toString()) - parseInt(a.id.toString()));
};

const findAttribute = async (params?: any) => {
  try {
    const result = await APIConfig(baseUrl).get<PhoneLeadAttributeType>("/lead/lead-attributes/", {
      params,
    });

    return {
      message: "",
      data: {
        channel: result.data.channel,
        data_status: result.data.data_status,
        fail_reason: sortAttributes(result.data.fail_reason),
        fanpage: result.data.fanpage,
        handle_reason: sortAttributes(result.data.handle_reason),
        tag: result.data.tag,
        product: result.data.product,
        bad_data_reason: sortAttributes(result.data.bad_data_reason),
      },
    };
  } catch (error) {
    return { message: "", data: null };
  }
};

const createAttribute = async ({ type, name }: { type: string; name: string }) => {
  try {
    const result = await APIConfig(baseUrl).post<AttributeType>("/lead/lead-attributes/", {
      type,
      name,
    });
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.CREATE_SUCCESS }));
    return { data: result.data, message: RESPONSE_MESSAGES.CREATE_SUCCESS };
  } catch (error: any) {
    return { data: null };
  }
};

const updateAttribute = async (params: {
  type: string;
  name?: string;
  id: number | string;
  is_shown?: boolean;
}) => {
  try {
    const result = await APIConfig(baseUrl).patch<AttributeType>(
      `/lead/lead-attributes/${params.id}/`,
      params
    );
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.UPDATE_SUCCESS }));
    return { data: result.data, message: RESPONSE_MESSAGES.UPDATE_SUCCESS };
  } catch (error: any) {
    return { data: null };
  }
};

const deleteAttribute = async ({
  type,
  name,
  id,
}: {
  type: string;
  name: string;
  id: number | string;
}) => {
  try {
    const result = await APIConfig(baseUrl).delete<{
      message: string;
    }>(`/lead/lead-attributes/${id}/`, {
      data: {
        type,
        name,
      },
    });
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.DELETE_SUCCESS }));
    return {
      data: result.status,
      message: RESPONSE_MESSAGES.DELETE_SUCCESS,
      status: 200,
    };
  } catch (error: any) {
    return { data: null };
  }
};

//phone lead
const get = async <T>({ params, endpoint = "leads/" }: { params?: any; endpoint?: string }) => {
  const { cancelToken, paramsNoneCancelToken } = convertCancelToken(params);

  const paramsURL = formatParamsToURLUtil(keyFilter, paramsNoneCancelToken);
  try {
    const result = await APIConfig(baseUrl).get<{
      results: T[];
      count: number;
      next: string | null;
      previous: string | null;
    }>(`/lead/${endpoint}`, {
      params: paramsURL,
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

const createPhoneLead = async <T>({
  form,
  endpoint = "leads/",
}: {
  form: any;
  endpoint?: string;
}) => {
  try {
    const result = await APIConfig(baseUrl).post<T>(`/lead/${endpoint}`, form);
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.CREATE_SUCCESS }));
    return {
      data: result.data,
      message: RESPONSE_MESSAGES.CREATE_SUCCESS,
    };
  } catch (error: any) {
    return { data: null };
  }
};

const updatePhoneLead = async <T>({
  endpoint = "leads/",
  form,
  id,
}: {
  id: string | number;
  form: Partial<T>;
  endpoint?: string;
}) => {
  try {
    const result = await APIConfig(baseUrl).patch<T>(`/lead/${endpoint}${id}/`, form);
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.UPDATE_SUCCESS }));
    return {
      data: { ...result.data, id },
      message: RESPONSE_MESSAGES.UPDATE_SUCCESS,
    };
  } catch (error: any) {
    return { data: null };
  }
};

const updatePhoneLeadHandle = async ({
  phone_leads,
  handle_by,
  endpoint,
}: {
  phone_leads: string[];
  handle_by?: string;
  endpoint?: string;
}) => {
  try {
    const result = await APIConfig(baseUrl).patch<{
      data: string;
      message: string;
    }>(`/lead/${endpoint}`, { phone_leads, handle_by });
    //update action handle by to refresh drawer report suggest saler
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.UPDATE_SUCCESS }));
    return {
      data: result.data,
      message: RESPONSE_MESSAGES.UPDATE_SUCCESS,
    };
  } catch (error: any) {
    return { data: null };
  }
};

const updateHandleByAuto = async ({
  phone_leads,
  endpoint,
}: {
  phone_leads: string[];
  endpoint?: string;
}) => {
  try {
    const result = await APIConfig(baseUrl).post<{
      handlers: string[];
      message: string;
    }>(`/lead/${endpoint}`, { phone_leads });
    //update action handle by to refresh drawer report suggest saler
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.UPDATE_SUCCESS }));
    return {
      data: result.data,
      message: RESPONSE_MESSAGES.UPDATE_SUCCESS,
    };
  } catch (error: any) {
    return { data: null };
  }
};

const deletePhoneLead = async <T>({ endpoint = "leads/" }: { endpoint: string }) => {
  try {
    const result = await APIConfig(baseUrl).delete<T>(`/lead/${endpoint}`);
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.DELETE_SUCCESS }));
    return {
      message: RESPONSE_MESSAGES.DELETE_SUCCESS,
      data: result,
    };
  } catch (error: any) {
    return { data: null };
  }
};

const updatePhoneLeadDataStatus = async ({
  phone_leads,
  data_status,
}: {
  phone_leads: string[];
  data_status: number;
}) => {
  try {
    const result = await APIConfig(baseUrl).patch<{
      data: string;
      message: string;
    }>(`/lead/update-data-status/`, { phone_leads, data_status });
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.UPDATE_SUCCESS }));
    return {
      data: result.data,
      message: RESPONSE_MESSAGES.UPDATE_SUCCESS,
    };
  } catch (error: any) {
    return { data: null };
  }
};

const getLogs = async ({ id, params }: { id: string; params?: any }) => {
  try {
    const result = await APIConfig(baseUrl).get<PhoneLogInfoType>(`/lead/leads/${id}/history/`, {
      params: params,
    });
    return {
      data: result.data,
      message: "",
    };
  } catch (error) {
    return { data: null };
  }
};

const getListPhoneExisted = async ({ params }: { params?: any }) => {
  try {
    const result = await APIConfig(baseUrl).get<{
      results: PhoneLeadResType[];
      count: number;
    }>(`/lead/existed-phone/`, {
      params: params,
    });
    return {
      data: result.data.results,
      message: "",
    };
  } catch (error) {
    return { data: null };
  }
};

export const reportKeyFilter = [
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
  "landing_page_domain",
];

const getReport = async <T = PhoneLeadReportType>({
  endpoint = "report/",
  params,
}: {
  params?: any;
  endpoint?: string;
}) => {
  try {
    const { cancelToken, paramsNoneCancelToken } = convertCancelToken(params);
    const paramsURL = formatParamsToURLUtil(reportKeyFilter, paramsNoneCancelToken);

    const result = await APIConfig(baseUrl).get<{
      results: T[];
      count: number;
      total: Partial<T>;
    }>(`/lead/${endpoint}`, {
      params: paramsURL,
      cancelToken,
    });
    return {
      data: result.data.results,
      count: result.data?.count || 0,
      total: result.data.total,
      message: "",
    };
  } catch (error) {
    return { data: null, message: "", count: 0, total: null };
  }
};

const getSalerOnlineDaily = async () => {
  try {
    const result = await APIConfig(baseUrl).get<{
      landing_page: SaleOnlineDailyType[];
      pancake: SaleOnlineDailyType[];
      crm: SaleOnlineDailyType[];
      campaign: SaleOnlineDailyType[];
    }>(`/lead/daily-handle-report/`);
    return {
      data: result.data,
      message: "",
    };
  } catch (error) {
    return { data: null, message: "" };
  }
};

const getListSpamCheck = async <T = InterceptType>() => {
  try {
    const result = await APIConfig(baseUrl).get<{
      results: T[];
      count: number;
    }>(`/lead/lead-spam-check/`);
    return {
      data: result.data,
      message: "",
    };
  } catch (error) {
    return { data: null, message: "" };
  }
};

const createSpamCheck = async <T>(data: InterceptType) => {
  try {
    const result = await APIConfig(baseUrl).post<T>(`/lead/lead-spam-check/`, data);
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.CREATE_SUCCESS }));
    return {
      data: result.data,
      message: RESPONSE_MESSAGES.CREATE_SUCCESS,
    };
  } catch (error: any) {
    return { data: null };
  }
};

const updateSpamCheck = async <T>({
  data,
  id,
}: {
  id: string | number;
  data: Partial<InterceptType>;
}) => {
  try {
    const result = await APIConfig(baseUrl).patch<T>(`/lead/lead-spam-check/${id}/`, data);
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.UPDATE_SUCCESS }));
    return {
      data: { ...result.data, id },
      message: RESPONSE_MESSAGES.UPDATE_SUCCESS,
    };
  } catch (error: any) {
    return { data: null };
  }
};

const deleteSpamCheck = async <T>(id: string) => {
  try {
    const result = await APIConfig(baseUrl).delete<T>(`/lead/lead-spam-check/${id}/`);
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.DELETE_SUCCESS }));
    return {
      message: RESPONSE_MESSAGES.DELETE_SUCCESS,
      data: result,
    };
  } catch (error: any) {
    return { data: null };
  }
};

//get list landi
const bareURLLandi = "https://backendsyncdata.skycom.vn/api";
const getListTanet = async <T>({
  params,
  endpoint = "tenants/",
}: {
  params?: any;
  endpoint?: string;
}) => {
  const { cancelToken, paramsNoneCancelToken } = convertCancelToken(params);

  const paramsURL = formatParamsToURLUtil(keyFilter, paramsNoneCancelToken);
  try {
    const result = await APIConfig(bareURLLandi).get<MultiResponseType<T>>(`/core/${endpoint}`, {
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

const getLinkLandiPage = async <T>({
  params,
  endpoint = "link-landi-page/",
}: {
  params?: any;
  endpoint?: string;
}) => {
  const { cancelToken, paramsNoneCancelToken } = convertCancelToken(params);

  const paramsURL = formatParamsToURLUtil(keyFilter, paramsNoneCancelToken);
  try {
    const result = await APIConfig(bareURLLandi).get<T[]>(`/spam_check/${endpoint}`, {
      params: paramsURL,
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
const createLinkLandipage = async <T>({
  form,
  endpoint = "link-landi-page/",
}: {
  form: any;
  endpoint?: string;
}) => {
  try {
    const result = await APIConfig(bareURLLandi).post<T>(`/spam_check/${endpoint}`, form);
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.CREATE_SUCCESS }));
    return {
      data: result.data,
      message: RESPONSE_MESSAGES.CREATE_SUCCESS,
    };
  } catch (error: any) {
    return { data: null };
  }
};
const updatelinklandipage = async <T>({
  endpoint = "link-landi-page/",
  form,
  id,
}: {
  id: string | number;
  form: Partial<T>;
  endpoint?: string;
}) => {
  try {
    const result = await APIConfig(bareURLLandi).patch<T>(`/spam_check/${endpoint}${id}/`, form);
    store.dispatch(toastSuccess({ message: RESPONSE_MESSAGES.UPDATE_SUCCESS }));
    return {
      data: { ...result.data, id },
      message: RESPONSE_MESSAGES.UPDATE_SUCCESS,
    };
  } catch (error: any) {
    return { data: null };
  }
};
export const phoneLeadApi = {
  get,
  findAttribute,
  createAttribute,
  updateAttribute,
  deleteAttribute,
  createPhoneLead,
  updatePhoneLead,
  getLogs,
  updatePhoneLeadHandle,
  getListPhoneExisted,
  updateHandleByAuto,
  getReport,
  updatePhoneLeadDataStatus,
  getSalerOnlineDaily,
  deletePhoneLead,
  getListSpamCheck,
  createSpamCheck,
  updateSpamCheck,
  deleteSpamCheck,
  getLinkLandiPage,
  createLinkLandipage,
  updatelinklandipage,
  getListTanet,
};
