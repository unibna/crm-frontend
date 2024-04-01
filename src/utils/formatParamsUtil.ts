import isBoolean from "lodash/isBoolean";
import produce from "immer";
import map from "lodash/map";
import isArray from "lodash/isArray";
import pick from "lodash/pick";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isObject from "lodash/isObject";
import { getObjectPropSafely } from "./getObjectPropsSafelyUtil";
import { objectiveFacebook } from "constants/index";
import axios from "axios";
import omit from "lodash/omit";
import { DIRECTION_SORT_TYPE } from "_types_/SortType";

let CancelToken = axios.CancelToken;

export const convertCancelToken = (params: any) => {
  const cancelToken = params?.cancelToken
    ? params?.cancelToken
    : new CancelToken(function (cancel) {});
  delete params?.cancelToken;
  delete params?.cancelRequest;

  return { cancelToken, paramsNoneCancelToken: params };
};

const ignoreKeys = [
  "dateValue",
  "defaultAssignedDate",
  "defaultProcessDate",
  "defaultCallLaterAtDate",
  "dateValue",
];

export const formatParamsToURLUtil = (keyFilter: string[], params?: any) => {
  let paramsURL = new URLSearchParams();
  let reqPar: string = "";
  for (reqPar in params) {
    if (!ignoreKeys?.includes(reqPar)) {
      if (params[reqPar]) {
        if (keyFilter.includes(reqPar)) {
          params[reqPar].length > 0 &&
            isArray(params[reqPar]) &&
            params[reqPar].map((item: string) => {
              item === "none" ? paramsURL.append(reqPar, "null") : paramsURL.append(reqPar, item);
              return item;
            });
        } else {
          paramsURL.append(reqPar, params[reqPar]);
        }
      }
    }
  }
  return paramsURL;
};

export const formatParamsToSkycomServerUtil = (keyFilter: string[], params?: any) => {
  let paramsURL = new URLSearchParams();
  let reqPar: string = "";
  for (reqPar in params) {
    if (params[reqPar]) {
      if (keyFilter.includes(reqPar)) {
        if (isArray(params[reqPar]) && params[reqPar].length) {
          const transferParams = [...params[reqPar]];
          const noneValueIdx = transferParams?.findIndex(
            (item: string | number) => item === "none"
          );
          if (noneValueIdx >= 0) {
            transferParams.splice(noneValueIdx, 1);
          }
          paramsURL.append(reqPar, transferParams.join(","));
        }
      } else {
        paramsURL.append(reqPar, params[reqPar]);
      }
    }
  }
  return paramsURL;
};

export const formatParamsUtilMore = (
  keyFilters: string[],
  params?: any,
  keyIgnores: string[] = ["trackingDateValue", "dateValue", "callDateValue"]
) => {
  let paramsURL = new URLSearchParams();
  let reqPar: string = "";
  for (reqPar in omit(params, keyIgnores)) {
    if (reqPar === "page") {
      paramsURL.append("page", params["page"]);
    } else if (reqPar === "offset") {
      paramsURL.append("offset", params["offset"]);
    } else if (params[reqPar] || isBoolean(params[reqPar])) {
      if (keyFilters.includes(reqPar)) {
        params[reqPar].length > 0 && isArray(params[reqPar])
          ? params[reqPar].map((item: string) => {
              item === "none" ? paramsURL.append(reqPar, "null") : paramsURL.append(reqPar, item);
              return item;
            })
          : paramsURL.append(reqPar, params[reqPar]);
      } else {
        paramsURL.append(reqPar, params[reqPar]);
      }
    }
  }
  return paramsURL;
};

export const formatSelectorForQueryParams = (
  value: string | number | "all" | "none" | (string | number)[]
) => {
  let formatValue: string | undefined | number | null | (string | number)[] = value;
  if (value === "all") {
    formatValue = undefined;
  } else if (value === "none") {
    formatValue = "null";
  } else if (Array.isArray(value)) {
    formatValue = produce(value, (items) => {
      if (items.includes("none")) {
        const index = items.findIndex((item) => item === "none");
        items[index] = "null";
      }
    });
  }
  return formatValue;
};

export const revertFromQueryForSelector = (
  params?: (string | number)[] | string | number,
  defaultValue: string = "all"
) => {
  if (typeof params === "string" || typeof params === "number") {
    return params;
  }
  return params ? map(params, (element) => (element === "null" ? "none" : element)) : defaultValue;
};

/**
 *
 * @param objParams old object params
 * @param arrItemSelect
 * @returns
 */
export const chooseParams = (objParams: any, arrItemSelect: string[] = []) => {
  let newParams: any = {};
  const newArrSelect = ["page", "limit", "ordering", ...arrItemSelect];

  for (let keyObj in objParams) {
    if (
      !newArrSelect.includes(keyObj) ||
      ["all", ""].includes(objParams[keyObj]) ||
      (Array.isArray(objParams[keyObj]) && !objParams[keyObj].length)
    ) {
      newParams = { ...newParams };
    } else {
      newParams = { ...newParams, [keyObj]: objParams[keyObj] };
    }
  }

  return newParams || {};
};

export const filterParams = (keys: string[], params?: any) => {
  let result = pick(params, keys);
  return result;
};

export const handleDeleteParam = (
  params: any,
  att: { type: string; value: string | number },
  setParams?: (params: any) => void
) => {
  if (params?.[att.type] && params) {
    const isArray = Array.isArray(params?.[att.type]);
    if (isArray) {
      const filterForArray = params?.[att.type].filter(
        (item: string[]) => item.toString() !== att.value.toString()
      );
      setParams &&
        setParams({
          ...params,
          [att.type]: filterForArray.length > 0 ? filterForArray : undefined,
        });
    } else {
      setParams &&
        setParams({
          ...params,
          [att.type]: undefined,
        });
    }
  }
};

export const clearParamsVar = (keysFilter: string[], params: any) => {
  let clearParams = { ...params };
  map(keysFilter, (item) => {
    if (clearParams?.[item]) {
      clearParams[item] = undefined;
    }
    return;
  });
  return clearParams;
};

export const handleParams: any = (params: any) => {
  return Object.keys(params).reduce((prevObj, current) => {
    return (isString(params[current]) && params[current]) ||
      (isArray(params[current]) && params[current].length) ||
      isNumber(params[current]) ||
      isBoolean(params[current])
      ? {
          ...prevObj,
          [current]: params[current],
        }
      : !isArray(params[current]) && isObject(params[current])
      ? {
          ...prevObj,
          [current]: handleParams(params[current]),
        }
      : prevObj;
  }, {});
};

export const handleParamsApi = (params: any, arrKeyGet: string[]) => {
  const { objective } = params;
  let newParams = {
    ...params,
  };

  if (objective && isArray(objective)) {
    newParams = {
      ...params,
      objective: getObjectPropSafely(() => objective.length)
        ? objective.reduce((prevArr, current) => {
            return objectiveFacebook[current]
              ? [...prevArr, ...objectiveFacebook[current]]
              : [...prevArr, current];
          }, [])
        : objective,
    };
  }

  return chooseParams(newParams, arrKeyGet);
};

export const handleParamsHeaderFilter = (params: any, arrTakeValue: string[]) => {
  return Object.keys(params).length
    ? Object.keys(params).reduce((prevObj, current) => {
        return arrTakeValue.includes(current)
          ? {
              ...prevObj,
              [current]: params[current],
            }
          : prevObj;
      }, {})
    : {};
};

export const handleCheckKeyParamsActive = ({
  keys,
  params,
}: {
  keys: { disabled?: boolean; label: string; color?: string; title?: string }[];
  params: any;
}) => {
  let result = true;
  let keysFilter: string[] = [];

  map(keys, (item) => {
    if (params?.[item.label] && !item.disabled) {
      // nếu filter là mãng rỗng thì không check;
      if (Array.isArray(params[item.label]) && params[item.label].length === 0) return;
      keysFilter.push(item.label);
      result = false;
    }
    return;
  });
  return { disabled: result, keysFilter };
};

const sortLabels = {
  source: "Kênh bán hàng",
  channel: "Kênh bán hàng",
  fanpage: "Fanpage",
  landing_page_domain: "Ladingpage URL",
  created: "Ngày tạo",
  created_at: "Ngày tạo",
  order_key: "Mã đơn",
  status: "Trạng thái",
  modified: "Ngày xử lý",
  modified_at: "Ngày xử lý",
  appointment_date: "Ngày gọi lại",
  call_later_at: "Ngày gọi lại",
  is_new_customer: "Loại khách hàng",
  name: "Tên",
  phone: "SĐT khách hàng",
  handle_status: "Số lần gọi",
  calldate: "Ngày gọi",
  note: "Ghi chú",
  customer_phone: "SĐT khách hàng",
  create_by: "Người tạo",
  created_by: "Người tạo",
  modified_by: "Người xử lý",
  handle_by: "Người xử lý",
  recent_handling: "Thời gian xử lý",
  handler_assigned_at: "Thời gian chi số",
  total_actual: "Tổng đơn hàng",
  total_variant_actual: "Tiền hàng",
  product: "Sản phẩm",
  date_start: "Thời gian bắt đầu",
  requirements: "Yêu cầu",
  applied_variant: "Sản phẩm áp dụng",
  total: "Tổng",
  pre_qualified: "Chất lượng trước xử lý",
  post_qualified: "Chất lượng sau xử lý",
  pre_not_qualified: "Ko chất lượng trước xử lý",
  post_not_qualified: "Ko chất lượng sau xử lý",
  processing: "Đang xử lý",
  processed: "Đã xử lý",
  buy: "Có mua",
  not_buy: "Không mua",
  buy_rate: "Tỷ lệ chốt",
  inbound: "Gọi vào",
  missed_inbound: "Gọi vào nhỡ",
  outbound: "Gọi ra",
  missed_outbound: "Gọi ra nhỡ",
  business_call_type__value: "Loại cuộc gọi",
  telephonist: "Người trực",
  date: "Ngày",
};
export const detectSortLabelUtil = (
  sort: string = "",
  sortFields: { [key: string]: string } = sortLabels
): { sortKey: string; label: string; direction: DIRECTION_SORT_TYPE } => {
  const direction = sort?.charAt(0) === "-" ? DIRECTION_SORT_TYPE.DESC : DIRECTION_SORT_TYPE.ASC;

  const newSort = direction === DIRECTION_SORT_TYPE.DESC ? sort.substring(1) : sort;

  return {
    sortKey: newSort,
    label: sortFields[newSort],
    direction,
  };
};
