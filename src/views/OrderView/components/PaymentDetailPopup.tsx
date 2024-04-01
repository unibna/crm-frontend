//hoooks
import CheckCircle from "@mui/icons-material/CheckCircle";
import Stack from "@mui/material/Stack";
import { orderApi } from "_apis_/order.api";
import { OrderPaymentTypeV2, OrderPaymentTypeValue } from "_types_/OrderType";
import DDataGrid, { DDataGridProps } from "components/DDataGrid";
import FormDialog from "components/Dialogs/FormDialog";
import MImage from "components/Images/MImage";
import { MTextLine } from "components/Labels";
import { UserTooltip } from "components/Tooltips";
import { ROLE_TAB, STATUS_ROLE_ORDERS } from "constants/rolesTab";
import { yyyy_MM_dd_HH_mm_ss } from "constants/time";
import format from "date-fns/format";
import isValid from "date-fns/isValid";
import useAuth from "hooks/useAuth";
import map from "lodash/map";
import pick from "lodash/pick";
import { useCallback, useEffect, useMemo, useState } from "react";
import { dispatch } from "store";
import { toastError, toastSuccess } from "store/redux/toast/slice";
import { fDateTime } from "utils/dateUtil";
import { fNumber, fValueVnd } from "utils/formatNumber";
import { isReadAndWriteRole } from "utils/roleUtils";
import { ORDER_PAYMENT_TYPE } from "../constants";
import { PAYMENT_COLUMNS } from "../constants/columns";
import { PaymentConfirmColumn, PaymentEditColumn } from "./columns";
import { DeliveryStatusColumn } from "./columns/DeliveryStatusColumn";

interface PaymentPopupProps {
  open: boolean;
  payments: Partial<OrderPaymentTypeV2>[];
  onClose: () => void;
  orderID?: string;
  onRefresh?: () => void;
}

function PaymentDetailPopup(props: PaymentPopupProps) {
  const { open, payments, onClose, orderID } = props;
  const [isUpdated, setIsUpdated] = useState(false);

  return (
    <FormDialog
      open={open}
      maxWidth="xl"
      title="Thông tin thanh toán"
      transition
      onClose={() => {
        onClose();
        isUpdated && props.onRefresh && props.onRefresh();
        setIsUpdated(false);
      }}
      isShowFooter={false}
      enableCloseByDropClick
    >
      <PaymentDetailTable payments={payments} orderID={orderID} setIsUpdated={setIsUpdated} />
    </FormDialog>
  );
}

export default PaymentDetailPopup;

const renderTrueOption = <CheckCircle sx={{ color: "primary.main" }} />;

interface PaymentDetailProps extends Partial<DDataGridProps> {
  payments: Partial<OrderPaymentTypeV2>[];
  orderID?: string;
  setIsUpdated?: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
  isEdit?: boolean;
}

export const PaymentDetailTable = ({
  payments,
  orderID,
  setIsUpdated,
  disabled,
  columns = PAYMENT_COLUMNS.columnsShowHeader,
  columnWidths = PAYMENT_COLUMNS.columnWidths,
  isEdit = true,
  ...props
}: PaymentDetailProps) => {
  const [data, setData] = useState<any>(payments);
  const { user } = useAuth();

  const renderFalseOption = "---";

  const isAlternativePaymentRole =
    isReadAndWriteRole(user?.is_superuser,
      user?.group_permission?.data?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.PAYMENT]
    ) && !disabled;

  const updateSingleMethod = useCallback(
    async (payment: OrderPaymentTypeV2) => {
      const receiveTime = new Date(payment.receive_time || "");
      return await orderApi.update({
        endpoint: `payment/${payment?.id}/`,
        params: pick(
          {
            ...payment,
            order: orderID,
            confirmed_by: user?.id,
            confirmed_date: format(new Date(), yyyy_MM_dd_HH_mm_ss),
            receive_time:
              payment.receive_time && isValid(receiveTime) ? payment.receive_time : null,
            actual_amount: payment.actual_amount || 0,
          },
          [
            "type",
            "is_confirmed",
            "confirmed_date",
            "confirmed_by",
            "amount",
            "order",
            "note",
            "receive_time",
            "actual_amount",
          ]
        ),
      });
    },
    [orderID, user?.id]
  );

  const handleUpdatePayment = useCallback(
    async (payment: OrderPaymentTypeV2, onUpdateSuccess?: any, setLoading?: any) => {
      setLoading && setLoading(true);
      const result = await updateSingleMethod(payment);
      if (result?.data) {
        dispatch(toastSuccess({ message: "Cập nhật thành công" }));
        onUpdateSuccess && onUpdateSuccess(result.data);
        setIsUpdated && setIsUpdated(true);
      } else {
        dispatch(toastError({ message: "Lỗi cập nhật. Vui lòng thử lại" }));
      }
      setLoading && setLoading(false);
    },
    [setIsUpdated, updateSingleMethod]
  );

  useEffect(() => {
    setData(payments);
  }, [payments]);

  const dataToShow = useMemo(() => {
    return data.reduce((prev: any, current: any, currentIndex: number) => {
      const { image, email, name } = current?.confirmed_by || {};

      const newItem = {
        ...current,
        type: {
          content: ORDER_PAYMENT_TYPE[current.type as OrderPaymentTypeValue].value,
        },
        amount: {
          content: `${fValueVnd(current.amount)}`,
        },
        confirmed_date: {
          content: (
            <>
              {!data?.[currentIndex].is_confirmed ? (
                renderFalseOption
              ) : (
                <Stack direction="column" spacing={2}>
                  <MTextLine
                    label="Thời gian:"
                    value={fDateTime(current?.confirmed_date) || "---"}
                    displayType="grid"
                  />
                  <MTextLine
                    label="Người XL:"
                    value={<UserTooltip user={{ email, image, name }} />}
                    displayType="grid"
                  />
                </Stack>
              )}
            </>
          ),
        },
        third_party_paid_status: {
          content: current?.third_party_paid_status ? renderTrueOption : renderFalseOption,
        },
        internal_paid_status: {
          content: current?.internal_paid_status ? renderTrueOption : renderFalseOption,
        },
        final_paid_status: {
          content: current?.final_paid_status ? renderTrueOption : renderFalseOption,
        },
        is_confirmed: {
          content: (
            <PaymentConfirmColumn
              disabled={
                data?.[currentIndex].is_confirmed ||
                !isAlternativePaymentRole ||
                disabled ||
                !isEdit
              }
              defaultValue={data?.[currentIndex]}
              handleUpdatePayment={(payment: any, onUpdateSuccess: any, setLoading: any) =>
                handleUpdatePayment(
                  {
                    ...data?.[currentIndex],
                    ...payment,
                  },
                  onUpdateSuccess,
                  setLoading
                )
              }
              payments={data}
              setPayments={setData}
              index={currentIndex}
            />
          ),
        },
        receive_info: {
          content: (
            <PaymentEditColumn
              disabled={!isEdit || !isAlternativePaymentRole}
              defaultValue={data?.[currentIndex]}
              handleUpdatePayment={(payment, onUpdateSuccess, setLoading) =>
                handleUpdatePayment(
                  {
                    ...data?.[currentIndex],
                    ...payment,
                  },
                  onUpdateSuccess,
                  setLoading
                )
              }
            />
          ),
        },
        upload_info: {
          content: (
            <Stack direction="column" spacing={2}>
              <MTextLine label="Người up:" value={current.upload_by?.name} />
              <MTextLine label="Thời gian up:" value={fDateTime(current.upload_at)} />
            </Stack>
          ),
        },
        order_info: {
          content: (
            <>
              <DeliveryStatusColumn
                orderKey={current.order_key}
                deliveryStatus={current.delivery_status}
                shippingUnit={current.shipping_unit}
                orderId={current.order_id}
              />
            </>
          ),
        },
        collation_info: {
          content: (
            <Stack direction="column" spacing={2}>
              <MTextLine label="Ngày đối soát:" value={fDateTime(current.upload_at)} />
              <MTextLine label="Tổng tiền nhận (Excel):" value={fNumber(current.file_amount)} />
              <MTextLine label="Mã giao dịch:" value={current.transaction_code} />
            </Stack>
          ),
        },
        images: {
          content: (
            <Stack direction="row">
              {map(current.images, (image, idx) => (
                <MImage src={image.image} height={80} width={80} preview key={idx} />
              ))}
            </Stack>
          ),
        },
      };
      return [...prev, newItem];
    }, []);
  }, [data, disabled, handleUpdatePayment, isAlternativePaymentRole]);

  return (
    <DDataGrid
      isFullTable
      isShowListToolbar={false}
      data={dataToShow}
      columns={columns}
      columnWidthsDefault={columnWidths}
      contentOptional={{
        arrColumnOptional: [
          "type",
          "amount",
          "confirmed_date",
          "third_party_paid_status",
          "internal_paid_status",
          "final_paid_status",
          "is_confirmed",
          "receive_info",
          // external collation table
          "upload_info",
          "order_info",
          "collation_info",
          "images",
        ],
      }}
      cardContainerStyles={{ boxShadow: "none" }}
      cellHeight={130}
      {...props}
    />
  );
};
