//hooks
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useCancelToken } from "hooks/useCancelToken";
import { memo, useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

//components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { MTabPanel } from "components/Tabs";
import CDPTimeline from "./CDPTimeline";
import Overview from "./Overview";

//types
import { AirtableType } from "_types_/AirTableType";
import { CustomerType } from "_types_/CustomerType";
import { CommentType, MessageType } from "_types_/FacebookType";
import { OrderType } from "_types_/OrderType";
import { PhoneLeadResType } from "_types_/PhoneLeadType";
import { RankType } from "_types_/RankType";

//apis
import { customerApi } from "_apis_/customer.api";
import { facebookApi } from "_apis_/facebook.api";
import { phoneLeadApi } from "_apis_/lead.api";
import { orderApi } from "_apis_/order.api";
import { skytableApi } from "_apis_/skytable.api";
import { zaloApi } from "_apis_/zalo.api";

//utils
import { yyyy_MM_dd } from "constants/time";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import drop from "lodash/drop";
import filter from "lodash/filter";
import flatten from "lodash/flatten";
import map from "lodash/map";
import { a11yPropsUtil } from "utils/a11yPropsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { CDP_TABLE_TABS } from "views/CDPView/constants";
import { formatHistoryCustomerCareStaffData } from "./tables/HistoryCDPTable/CustomerCareStaffTable";

export interface CDPDataType {
  messData: { count: number; data: MessageType[] };
  commentData: { count: number; data: CommentType[] };
}

export interface CDPProps {
  customerDefault?: Partial<CustomerType>;
  params?: { date_from: string; date_to: string; toValue?: any };
  isMutationNote?: boolean;
  isMutationCustomer?: boolean;
  overviewLayoutColumns: {
    xs: 1;
    sm: 1;
    md: 1 | 2;
    lg: 1 | 2 | 3;
    xl: 1 | 2 | 3;
  };
  onRefreshCDPRow?: (customer: Partial<CustomerType>) => void;
  isSearchCustomer?: boolean;
  isShowTimeline?: boolean;
  isShowTableDetail?: boolean;
}

const CustomerDetail = (props: Omit<CDPProps, "params">) => {
  const {
    overviewLayoutColumns,
    customerDefault,
    isMutationCustomer,
    isMutationNote,
    isSearchCustomer,
    isShowTableDetail,
    isShowTimeline,
    onRefreshCDPRow,
  } = props;

  let [tagCategoryFilter, setTagCategoryFilter] = useState<{
    [key: string]: string;
  }>({});
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [params, setParams] = useState<any>({
    limit: 200,
    page: 1,
    created_from: format(subDays(new Date(), 90), yyyy_MM_dd),
    created_to: format(subDays(new Date(), 0), yyyy_MM_dd),
    dateValue: 91,
  });
  const { newCancelToken } = useCancelToken();
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [data, setData] = useState<any>([]);
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));
  const [orderStatusAnalyst, setOrderStatusAnalyst] = useState<{
    orders: number[];
    total: number;
  }>({ orders: [], total: 0 });

  const [phoneInfo, setPhoneInfo] = useState<Partial<CustomerType>>();
  const { search } = useLocation();

  const getLeadData = useCallback(async () => {
    if (phoneInfo?.phone) {
      const res = await phoneLeadApi.get<PhoneLeadResType>({
        params: {
          search: phoneInfo?.phone,
          limit: 200,
          page: 1,
          ...params,
          cancelToken: newCancelToken(),
        },
      });
      if (res.data) {
        if (res.data.results.length > 0) {
          setTagCategoryFilter((prev) => ({ ...prev, LEAD: "Lead Center" }));
        }

        const result = map(res.data.results, (item) => ({
          history_date: item.created,
          category: "LEAD",
          label: "Tạo Lead",
          ...item,
        }));
        return result;
      }
      return [];
    }
    return [];
  }, [newCancelToken, params, phoneInfo?.phone]);

  const getOrderData = useCallback(async () => {
    if (phoneInfo?.id) {
      const res = await orderApi.get<OrderType>({
        params: {
          customer: phoneInfo.id,
          limit: 200,
          page: 1,
          ...params,
          cancelToken: newCancelToken(),
        },
        endpoint: "get/all/",
      });

      if (res.data) {
        if (res.data.results.length > 0) {
          setTagCategoryFilter((prev) => ({ ...prev, ORDER: "Đơn hàng" }));
        }
        const result = map(res.data.results, (item) => ({
          history_date: item.created,
          category: "ORDER",
          label: "Tạo đơn hàng",
          ...item,
        }));
        return result;
      }
      return [];
    } else {
      return [];
    }
  }, [newCancelToken, params, phoneInfo?.id]);

  const getCustomerCareStaffData = useCallback(async () => {
    if (phoneInfo?.id) {
      const res = await customerApi.get<OrderType>({
        params: {
          customer: phoneInfo.id,
          limit: 200,
          page: 1,
          ...params,
          cancelToken: newCancelToken(),
        },
        endpoint: `v2/${phoneInfo.id}/history/`,
      });

      if (res.data) {
        if (res.data.results.length > 0) {
          setTagCategoryFilter((prev) => ({ ...prev, NCS: "Người chăm sóc" }));
        }
        const formatData = formatHistoryCustomerCareStaffData(res.data.results);
        const result = map(formatData, (item) => ({
          category: "NCS",
          label: "Người chăm sóc",
          ...item,
        }));
        return result;
      }
      return [];
    } else {
      return [];
    }
  }, [newCancelToken, params, phoneInfo?.id]);

  const getCommentData = useCallback(async () => {
    if (phoneInfo?.phone) {
      const res = await facebookApi.get<CommentType>(
        {
          phone: phoneInfo?.phone,
          limit: 200,
          page: 1,
          date_from: params.created_from,
          date_to: params.created_to,
          ...params,
          cancelToken: newCancelToken(),
        },
        "comments/"
      );
      if (res.data) {
        if (res.data.results.length > 0) {
          setTagCategoryFilter((prev) => ({ ...prev, COMMENT: "Comment" }));
        }

        const result = map(res.data.results, (item) => ({
          history_date: item.created_time,
          category: "COMMENT",
          label: "Comment",
          ...item,
        }));
        return result;
      }
      return [];
    } else {
      return [];
    }
  }, [newCancelToken, params, phoneInfo?.phone]);

  const getInboxData = useCallback(async () => {
    if (phoneInfo?.phone) {
      const res = await facebookApi.get<MessageType>(
        {
          phone: phoneInfo?.phone,
          limit: 200,
          page: 1,
          date_from: params.created_from,
          date_to: params.created_to,
          ...params,
          cancelToken: newCancelToken(),
        },
        "messages/"
      );
      if (res.data) {
        if (res.data.results.length > 0) {
          setTagCategoryFilter((prev) => ({ ...prev, INBOX: "Inbox" }));
        }

        const result = map(res.data.results, (item) => ({
          history_date: item.created_time,
          category: "INBOX",
          label: "Tin nhắn",
          ...item,
        }));
        return result;
      }
      return [];
    } else {
      return [];
    }
  }, [newCancelToken, params, phoneInfo?.phone]);

  const getHistoryRank = useCallback(async () => {
    if (phoneInfo?.id) {
      const res = await customerApi.get<RankType>({
        endpoint: "history/",
        params: {
          limit: 200,
          page: 1,
          ...params,
          modified__date__gte: params?.created_from,
          modified__date__lte: params?.created_to,
          customer_id: phoneInfo.id,
        },
      });
      if (res.data) {
        if (res.data.results.length > 0) {
          setTagCategoryFilter((prev) => ({ ...prev, CDP_RANK: "CDP" }));
        }

        const result = map(res.data.results, (item) => ({
          history_date: item.modified,
          category: "CDP_RANK",
          label:
            item.field_changed === "birthday"
              ? "Cập nhật ngày sinh"
              : item.field_changed === "ranking"
              ? "Nâng hạng"
              : "Cập nhật ghi chú",
          ...item,
        }));
        return result;
      }
      return [];
    } else {
      return [];
    }
  }, [params, phoneInfo?.id]);

  const getListCskh = useCallback(async () => {
    if (phoneInfo?.phone) {
      const res = await skytableApi.get<AirtableType>(
        {
          limit: 200,
          page: 1,
          search: phoneInfo?.phone,
          ...params,
          created__date__gte: params.created_from,
          created__date__lte: params.create_to,
        },
        "customer-care/"
      );

      if (res?.data) {
        if (res.data.results.length > 0) {
          setTagCategoryFilter((prev) => ({ ...prev, CSKH: "CSKH" }));
        }

        const result = map(res.data.results, (item) => ({
          history_date: item.created,
          category: "CSKH",
          label: "Phản hồi từ KH",
          ...item,
        }));
        return result;
      }
      return [];
    }
    return [];
  }, [params, phoneInfo?.phone]);

  const getZaloData = useCallback(async () => {
    if (phoneInfo?.phone) {
      const res = await zaloApi.get<any>(
        {
          limit: 200,
          page: 1,
          ...params,
          created__date__gte: params.created_from,
          created__date__lte: params.create_to,
          search:
            getObjectPropSafely(() => phoneInfo?.phone?.[0]) === "8"
              ? "0" + drop(phoneInfo?.phone, 2).join("")
              : phoneInfo?.phone,
        },
        "auto-notification-zns/"
      );
      if (res?.data) {
        if (res.data.results.length > 0) {
          setTagCategoryFilter((prev) => ({ ...prev, ZALO: "ZALO" }));
        }
        const result = map(res.data.results, (item) => ({
          history_date: item.created,
          category: "ZALO",
          label: "Thông báo Zalo",
          ...item,
        }));
        return result;
      }
      return [];
    }
    return [];
  }, [params, phoneInfo?.phone]);

  useEffect(() => {
    const query = new URLSearchParams(search);
    const phone = query.get("phone") || "";
    const name = query.get("name") || "";

    setPhoneInfo(
      search
        ? {
            phone: phone,
            full_name: name,
            ...customerDefault,
          }
        : customerDefault
    );
  }, [customerDefault, search]);

  const getData = useCallback(async () => {
    if (isShowTimeline) {
      setLoading(true);
      const historyArr: any[] = await Promise.all([
        getLeadData(),
        getOrderData(),
        getCommentData(),
        getInboxData(),
        getHistoryRank(),
        getListCskh(),
        getZaloData(),
        getCustomerCareStaffData(),
      ]);

      setData(flatten(historyArr).sort((a, b) => (a.history_date >= b.history_date ? -1 : 1)));

      setLoading(false);
    }
  }, [
    getCommentData,
    getHistoryRank,
    getInboxData,
    getLeadData,
    getListCskh,
    getOrderData,
    getZaloData,
    getCustomerCareStaffData,
    isShowTimeline,
  ]);

  const handleChangeCustomer = useCallback((customer: CustomerType) => {
    setPhoneInfo((prev) => (prev ? { ...prev, ...customer } : undefined));
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Box
      style={{
        width: "100%",
        position: "relative",
        overflow: "auto",
      }}
    >
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          md={overviewLayoutColumns.md === 1 ? 12 : 6}
          lg={overviewLayoutColumns.md === 1 ? 12 : 6}
          height="fit-content"
        >
          <Overview
            customer={phoneInfo}
            setCustomer={handleChangeCustomer}
            isMutationCustomer={isMutationCustomer}
            onRefreshCDPRow={onRefreshCDPRow}
            isSearchCustomer={isSearchCustomer}
            isShowTableDetail={isShowTableDetail}
            orderStatusAnalyst={orderStatusAnalyst}
          />
        </Grid>
        {isShowTimeline && (
          <Grid
            item
            xs={12}
            md={overviewLayoutColumns.md === 1 ? 12 : 6}
            lg={6}
            sx={{
              overflow: "hidden",
              maxHeight: mdDown ? 360 : undefined,
              contain: mdDown ? undefined : "size",
              "&:hover": { overflow: "auto" },
            }}
            style={{ paddingTop: 24, paddingBottom: 8, paddingRight: 8 }}
          >
            <CDPTimeline
              // danh sách những item có category được chọn hoặc khi không chọn category( lấy tất cả)
              data={filter(data, (item) => item.category === categoryFilter || !categoryFilter)}
              loading={loading}
              params={params}
              setParams={(values) => setParams({ ...values })}
              tagCategoryFilter={tagCategoryFilter}
              onFilterCategory={setCategoryFilter}
              categoryFilter={categoryFilter}
            />
          </Grid>
        )}
      </Grid>
      {isShowTableDetail && (
        <Stack spacing={2} p={1}>
          <Paper className="relative" elevation={1} style={{ padding: 8 }}>
            <Tabs
              variant="scrollable"
              scrollButtons="auto"
              value={tab}
              onChange={(event: React.SyntheticEvent, newValue: number) => {
                setTab(newValue);
              }}
              aria-label="basic tabs example"
            >
              {map(
                CDP_TABLE_TABS({
                  id: phoneInfo?.id,
                  phone: phoneInfo?.phone,
                  isMutationNote,
                }),
                (item, index) => (
                  <Tab label={item.name} {...a11yPropsUtil(index)} key={index} />
                )
              )}
            </Tabs>
          </Paper>
          {map(
            CDP_TABLE_TABS({
              id: phoneInfo?.id,
              phone: phoneInfo?.phone,
              isMutationNote,
              analystOrderStatus: setOrderStatusAnalyst,
            }),
            (item, index) => (
              <MTabPanel value={tab} index={index} key={index}>
                {item.component}
              </MTabPanel>
            )
          )}
        </Stack>
      )}
    </Box>
  );
};

export default memo(CustomerDetail);
