import Timeline from "@mui/lab/Timeline";
import { timelineOppositeContentClasses } from "@mui/lab/TimelineOppositeContent";
import { TitleSection } from "components/Labels";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { NoDataPanel } from "components/DDataGrid/components";
import HistoryItem from "./HistoryItem";

//apis
import { deliveryApi } from "_apis_/delivery.api";
import { orderApi } from "_apis_/order.api";

//types
import { OrderType } from "_types_/OrderType";
import { FacebookType } from "_types_/FacebookType";

//hooks
import useIsMountedRef from "hooks/useIsMountedRef";

//utils
import map from "lodash/map";
import isEqual from "lodash/isEqual";
import flatten from "lodash/flatten";
import { HISTORY_ACTIONS } from "constants/index";
import { useCallback, useEffect, useState } from "react";

/**
 * So sánh prevItem và currentItem và trả về một object mới gồm những key có giá trị khác nhau
 */
const handleChangeOrderHistoryNewData = ({
  currItem,
  prevItem,
  category,
}: {
  currItem?: any;
  prevItem?: any;
  category: "SHIPPING" | "ORDER";
}) => {
  let result: Partial<any> = {};
  Object.keys(currItem).map((item) => {
    if (!isEqual(currItem?.[item], prevItem?.[item])) {
      result[item] = currItem?.[item];
    }
  });
  return {
    ...result,
    category,
    history_action: currItem.history_type || currItem.history_action,
    history_date: Object.keys(result).length
      ? currItem.history_date
        ? new Date(currItem.history_date)
        : undefined
      : undefined,
  };
};

export default function OrderHistoryTimeline({ order }: { order: OrderType }) {
  const isMountedRef = useIsMountedRef();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getShippingHistory = useCallback(async () => {
    if (order.shipping?.id) {
      const result = await deliveryApi.get<Partial<FacebookType>>(
        { page: 1, limit: 100, ordering: "history_date" },
        `shipment/${order.shipping.id}/history/`
      );
      if (result?.data && isMountedRef.current) {
        return map(result.data.results, (item, idx) =>
          handleChangeOrderHistoryNewData({
            currItem: { delivery_company_type: order.shipping?.delivery_company_type, ...item },
            prevItem: {
              ...result?.data?.results[idx - 1],
              delivery_company_type: idx === 0 ? undefined : order.shipping?.delivery_company_type,
            },
            category: "SHIPPING",
          })
        );
      } else {
        return [];
      }
    }
    return [];
  }, [isMountedRef, order.shipping?.delivery_company_type, order.shipping?.id]);

  const getOrderHistory = useCallback(async () => {
    if (order.id) {
      const result = await orderApi.get<OrderType>({
        params: { order_id: order.id, page: 1, limit: 100, ordering: "history_date" },
        endpoint: "history/",
      });
      if (result?.data && isMountedRef.current) {
        return map(result.data.results, (item, idx) =>
          handleChangeOrderHistoryNewData({
            currItem: item,
            prevItem: { ...result.data.results[idx - 1], modified_by: undefined },
            category: "ORDER",
          })
        );
      } else {
        return [];
      }
    }
    return [];
  }, [order.id, isMountedRef]);

  /**
   * Format lại dữ liệu payment cần có history_date và history_action
   * Nếu có ngày xác nhận thì history_date = confirm_date và trạng thái là history_action = CONFIRM
   * Nếu không có ngày xác nhận thì làm history_date = ngày tạo của order (order.created) và trạng thái là history_action = CREATE
   */
  const handleConvertPayment = useCallback(() => {
    return map(order.payments, (item) => {
      let history_action: HISTORY_ACTIONS | undefined;
      let history_date: string | undefined | Date;
      if (item.is_confirmed && item.confirmed_date) {
        history_date = new Date(item.confirmed_date);
        history_action = HISTORY_ACTIONS.CONFIRM;
      } else {
        // tạo thanh toán ngay sau khi tạo đơn hàng
        const paymentDate = order.created ? new Date(order.created) : undefined;
        paymentDate?.setSeconds(paymentDate.getSeconds() + 1);
        history_date = paymentDate;
        history_action = HISTORY_ACTIONS.CREATE;
      }
      return { ...item, history_date, history_action, category: "PAYMENT" };
    });
  }, [order.created, order.payments]);

  /**
   * Format lại dữ liệu warehouse cần có history_date và history_action
   * Nếu có ngày xác nhận thì history_date = confirm_date và trạng thái là history_action = CONFIRM
   * Nếu không có ngày xác nhận thì làm history_date = ngày tạo của vận đơn (order.shipping.created) và trạng thái là history_action = CREATE
   */
  const handleConvertWarehouse = useCallback(() => {
    return map(order.sheets, (item) => {
      let history_date: string | undefined | Date;
      let history_action: HISTORY_ACTIONS | undefined;
      if (item.is_confirm && item.confirmed_date) {
        history_date = new Date(item.confirmed_date);
        history_action = HISTORY_ACTIONS.CONFIRM;
      } else {
        //tạo kho sau khi tạo vận đơn
        const warehouseDate = order.shipping?.created
          ? new Date(order.shipping?.created)
          : undefined;
        warehouseDate?.setSeconds(warehouseDate.getSeconds() + 1);
        history_date = warehouseDate;
        history_action = HISTORY_ACTIONS.CREATE;
      }
      return { ...item, history_date, history_action, category: "WAREHOUSE" };
    });
  }, [order.sheets, order.shipping?.created]);

  const getData = useCallback(async () => {
    setLoading(true);
    const historyArr: any[] = await Promise.all([
      handleConvertPayment(),
      handleConvertWarehouse(),
      getOrderHistory(),
      getShippingHistory(),
    ]);

    setData(flatten(historyArr).sort((a, b) => (a.history_date >= b.history_date ? -1 : 1)));
    setLoading(false);
  }, [getOrderHistory, getShippingHistory, handleConvertPayment, handleConvertWarehouse]);

  useEffect(() => {
    order.id && getData();
  }, [order.id, order.shipping?.id, getData]);

  return (
    <>
      <TitleSection>Lịch sử</TitleSection>
      {loading ? (
        <SkeletonLoading />
      ) : (
        <Timeline
          sx={{
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0.2,
            },
            padding: 0,
          }}
        >
          {data.length ? (
            map(data, (item, id) => (
              <HistoryItem
                key={id}
                value={item}
                payments={order.payments}
                handleRefresh={() => {}}
                shipping={order.shipping}
                sheets={order.sheets}
                source={order.source}
              />
            ))
          ) : (
            <NoDataPanel showImage />
          )}
        </Timeline>
      )}
    </>
  );
}

const SkeletonLoading = () => {
  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1}>
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={80} />
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={300} />
      </Stack>
      <Stack direction="row" spacing={1}>
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={80} />
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={300} />
      </Stack>
      <Stack direction="row" spacing={1}>
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={80} />
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={300} />
      </Stack>
      <Stack direction="row" spacing={1}>
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={80} />
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={300} />
      </Stack>
      <Stack direction="row" spacing={1}>
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={80} />
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={300} />
      </Stack>
      <Stack direction="row" spacing={1}>
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={80} />
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={300} />
      </Stack>
    </Stack>
  );
};
