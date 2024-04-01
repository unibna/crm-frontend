//hooks
import { useTheme } from "@mui/material";
import useAuth from "hooks/useAuth";
import { useCancelToken } from "hooks/useCancelToken";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

//utils
import { ROLE_TAB, ROLE_TYPE, STATUS_ROLE_ORDERS } from "constants/rolesTab";
import omit from "lodash/omit";
import { ORDER_PATH, PATH_DASHBOARD } from "routes/paths";
import { isCancelRequest } from "utils/helpers";
import { isMatchRoles } from "utils/roleUtils";

//components
import InfoIcon from "@mui/icons-material/Info";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { TabRouteWrap } from "components/Tabs";
import OrderAnalytic from "views/OrderView/components/OrderAnalytic";

//apis
import BallotIcon from "@mui/icons-material/Ballot";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import { deliveryApi } from "_apis_/delivery.api";
import { orderApi } from "_apis_/order.api";
import { DeliveryType } from "_types_/ShippingType";
import { UserType } from "_types_/UserType";
import { TITLE_PAGE } from "constants/index";
import { CancelReducerType, useCanceledReducer } from "./reducers/CancelReducer";
import { CompletedReducerType, useCompletedReducer } from "./reducers/CompletedReducer";
import { DraftReducerType, useDraftReducer } from "./reducers/DraftReducer";
import { TabAllReducerType, useTabAllReducer } from "./reducers/TabAllReducer";

export const ORDER_TABS = (
  user: Partial<UserType> | null,
  roles?: {
    [key in ROLE_TAB]?: {
      [key: string]: ROLE_TYPE;
    };
  }
) => [
  {
    label: "Tất cả",
    path: `/${PATH_DASHBOARD[ROLE_TAB.ORDERS][ORDER_PATH.LIST][ORDER_PATH.ALL]}`,
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.HANDLE]),
    icon: <BallotIcon />,
  },
  {
    label: "Đơn chưa xác nhận",
    path: `/${PATH_DASHBOARD[ROLE_TAB.ORDERS][ORDER_PATH.LIST][ORDER_PATH.DRAFT]}`,
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.HANDLE]),
    icon: <WatchLaterIcon />,
  },
  {
    label: "Đơn xác nhận",
    path: `/${PATH_DASHBOARD[ROLE_TAB.ORDERS][ORDER_PATH.LIST][ORDER_PATH.COMPLETED]}`,
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.HANDLE]),
    icon: <CheckCircleIcon />,
  },
  {
    label: "Đơn huỷ",
    path: `/${PATH_DASHBOARD[ROLE_TAB.ORDERS][ORDER_PATH.LIST][ORDER_PATH.CANCEL]}`,
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.HANDLE]),
    icon: <CancelIcon />,
  },
];

const OrderPage = () => {
  const { user } = useAuth();
  const theme = useTheme();

  const orderContext = useContext(OrderContext);

  const { all = 0, draft = 0, completed = 0, cancel = 0 } = orderContext?.statusAmount.value || {};
  const isHandleOrder = isMatchRoles(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.HANDLE]
  );

  return (
    <>
      <Paper sx={{ mt: 4, mb: 1, position: "relative" }} variant="outlined">
        {isHandleOrder && <AmountStatusOrderDetail />}
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: "dashed" }} />}
          sx={{ py: 2, overflowX: "auto" }}
        >
          <OrderAnalytic
            title="Tất cả"
            total={all}
            percent={100}
            price={0}
            icon="ic:round-receipt"
            color={theme.palette.info.main}
          />
          <OrderAnalytic
            title="Đơn chưa xác nhận"
            total={draft}
            percent={Math.round((draft / all) * 100)}
            price={0}
            icon="eva:clock-fill"
            color={theme.palette.action.disabled}
          />
          <OrderAnalytic
            title="Đơn xác nhận"
            total={completed}
            icon="eva:checkmark-circle-2-fill"
            percent={Math.round((completed / all) * 100)}
            price={0}
            color={theme.palette.success.main}
          />
          <OrderAnalytic
            title="Đơn huỷ"
            total={cancel}
            percent={Math.round((cancel / all) * 100)}
            price={0}
            icon="ic:round-cancel"
            color={theme.palette.error.main}
          />
        </Stack>
        {orderContext?.statusAmount.loading && <LinearProgress />}
      </Paper>

      <TabRouteWrap
        setTabValue={() => orderContext?.getStatusAmount()}
        routes={ORDER_TABS(user, user?.group_permission?.data)}
        title={TITLE_PAGE.ORDER}
      />
    </>
  );
};

export type OrderContextType =
  | (Partial<TabAllReducerType & DraftReducerType & CompletedReducerType & CancelReducerType> & {
      tags: { id: number; name: string; is_shown?: boolean }[];
      getTags: () => Promise<void>;
      cancelReasons: { id: number; name: string; is_shown?: boolean }[];
      getCancelReasons: () => Promise<void>;
      deliveryCompany: DeliveryType[];
      statusAmount: {
        value: {
          all: number;
          cancel: number;
          completed: number;
          draft: number;
        };
        loading: boolean;
      };
      getStatusAmount: () => Promise<void>;
      setPageParams: React.Dispatch<any>;
      pageParams: any;
    })
  | null;

export const OrderContext = createContext<OrderContextType>(null);

const OrderView = () => {
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
  const [cancelReasons, setCancelReasons] = useState<{ id: number; name: string }[]>([]);
  const [deliveryCompany, setDeliveryCompany] = useState<DeliveryType[]>([]);
  const [pageParams, setPageParams] = useState<any>({});
  const { newCancelToken } = useCancelToken([pageParams]);

  const [statusAmount, setStatusAmount] = useState<{
    value: { all: number; cancel: number; completed: number; draft: number };
    loading: boolean;
  }>({
    value: { all: 0, cancel: 0, completed: 0, draft: 0 },
    loading: false,
  });

  const getListShippingCompany = useCallback(async () => {
    const result = await deliveryApi.get<DeliveryType>(
      { limit: 100, page: 1 },
      "delivery-company/"
    );

    if (result?.data) {
      setDeliveryCompany(result.data.results);
    }
  }, []);

  const getTags = useCallback(async () => {
    const result = await orderApi.get<{ id: number; name: string }>({
      endpoint: "tag/",
      params: { limit: 200, page: 1, is_show: true },
    });
    if (result?.data) {
      setTags(result.data.results);
    }
  }, []);

  const getCancelReasons = useCallback(async () => {
    const result = await orderApi.get<{ id: number; name: string }>({
      endpoint: "cancel_reason/",
      params: { limit: 200, page: 1 },
    });
    if (result?.data) {
      setCancelReasons(result.data.results);
    }
  }, []);

  const getStatusAmount = useCallback(async () => {
    setStatusAmount((prev) => ({ ...prev, loading: true }));
    const result = await orderApi.get<any>({
      endpoint: "status/count/",
      params: { ...omit(pageParams, ["limit", "page", "status"]), cancelToken: newCancelToken() },
    });
    if (result?.data) {
      const data: any = result.data;
      setStatusAmount({ value: data, loading: false });
      return;
    }
    !isCancelRequest(result) && setStatusAmount((prev) => ({ ...prev, loading: false }));
  }, [newCancelToken, pageParams]);

  useEffect(() => {
    Promise.all([getTags(), getCancelReasons(), getListShippingCompany()]);
  }, [getTags, getListShippingCompany, getCancelReasons]);

  useEffect(() => {
    getStatusAmount();
  }, [getStatusAmount]);

  return (
    <OrderContext.Provider
      value={{
        ...useTabAllReducer(),
        ...useDraftReducer(),
        ...useCompletedReducer(),
        ...useCanceledReducer(),
        tags,
        getTags,
        cancelReasons,
        getCancelReasons,
        deliveryCompany,
        statusAmount,
        getStatusAmount,
        pageParams,
        setPageParams,
      }}
    >
      <OrderPage />
    </OrderContext.Provider>
  );
};

export default OrderView;

const AmountStatusOrderDetail = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 3,
        right: 3,
        zIndex: 1000,
      }}
    >
      <Tooltip title={<>Số liệu được tính dựa vào bộ lọc của tab hiện tại</>}>
        <InfoIcon style={{ cursor: "pointer" }} color="action" />
      </Tooltip>
    </Box>
  );
};
