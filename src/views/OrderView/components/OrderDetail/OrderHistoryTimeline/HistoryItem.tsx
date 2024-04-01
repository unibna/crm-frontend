//components
import * as React from "react";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import Box from "@mui/material/Box";
import PaymentDetailPopup from "../../PaymentDetailPopup";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";

//types
import { OrderPaymentTypeV2, OrderShippingType } from "_types_/OrderType";
import { WarehouseSheetType } from "_types_/WarehouseType";

//utils
import find from "lodash/find";
import { fDate, fDateTime } from "utils/dateUtil";
import { matchMarketplaceUrlFromEcommerceCode } from "features/order/matchMarketplaceUrlFromEcommerceCode";
import {
  deliveryCodeUrl,
  optionStatusShipping,
  TYPE_SHIPPING_COMPANIES,
} from "views/ShippingView/constants";
import { isMatchRoles } from "utils/roleUtils";
import { ROLE_TAB, STATUS_ROLE_ORDERS, STATUS_ROLE_WAREHOUSE } from "constants/rolesTab";
import { fNumber } from "utils/formatNumber";

//hooks
import useAuth from "hooks/useAuth";
import { HISTORY_ACTIONS } from "constants/index";
import { AttributeType } from "_types_/AttributeType";
import { PAYMENT_TYPE_VALUES } from "views/OrderView/constants/options";
import { CopyIconButton } from "components/Buttons";
import { PRIMARY_COLOR } from "assets/color";
import { SxProps, Theme, useTheme } from "@mui/material";

const HistoryItem = ({
  value,
  payments,
  shipping,
  handleRefresh,
  sheets,
  source,
}: {
  value: any;
  shipping?: OrderShippingType;
  payments?: Partial<OrderPaymentTypeV2>[];
  sheets?: WarehouseSheetType[];
  handleRefresh?: () => void;
  source?: AttributeType;
}) => {
  const { user } = useAuth();
  const theme = useTheme();
  const styles = styled(theme);

  const [isPaymentModalOpen, setIsPaymentOpen] = React.useState(false);

  const isShowPayment = isMatchRoles(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.PAYMENT]
  );

  let category: string | undefined;
  let content: JSX.Element | undefined;

  const marketUrl = matchMarketplaceUrlFromEcommerceCode(value.ecommerce_code, value.source);

  // Đơn hàng
  if (value.category === "ORDER") {
    category = "Đơn hàng";
    if (value.history_date) {
      content = (
        <Stack spacing={0.5}>
          {/* khi tạo đơn thì show payments luôn */}
          {value.history_action === HISTORY_ACTIONS.CREATE && value.status === "draft" ? (
            <Typography fontSize={13} fontWeight="bold">{`Trạng thái: Chưa xác nhận`}</Typography>
          ) : null}
          {value.is_printed ? (
            <Typography fontSize={13}>{`Người in: ${value?.printed_by?.name}`}</Typography>
          ) : null}
          {value.status === "cancel" ? (
            <>
              <Typography fontSize={13} fontWeight="bold">{`Trạng thái: Huỷ`}</Typography>
              <Typography
                fontSize={13}
                fontWeight="bold"
              >{`Lý do huỷ: ${value?.cancel_reason?.name}`}</Typography>
            </>
          ) : null}
          {value.status === "completed" ? (
            <Typography fontSize={13} fontWeight="bold">{`Trạng thái: Xác nhận`}</Typography>
          ) : null}

          {value?.created_by ? (
            <Typography fontSize={13}>{`Người tạo: ${value?.created_by?.name}`}</Typography>
          ) : null}
          {value?.modified_by && value.history_action === HISTORY_ACTIONS.CONFIRM ? (
            <Typography fontSize={13}>{`Người xác nhận: ${value?.modified_by?.name}`}</Typography>
          ) : null}
          {value?.modified_by && value.history_action === HISTORY_ACTIONS.CANCEL ? (
            <Typography fontSize={13}>{`Người huỷ: ${value?.modified_by?.name}`}</Typography>
          ) : null}
          {value?.modified_by && value.history_action === HISTORY_ACTIONS.UPDATE ? (
            <Typography fontSize={13}>{`Người cập nhật: ${value?.modified_by?.name}`}</Typography>
          ) : null}

          {value?.cross_sale_amount !== undefined ? (
            <Typography fontSize={13}>{`CrossSale: ${fNumber(
              value.cross_sale_amount
            )}`}</Typography>
          ) : null}
          {value.customer_name ? (
            <Typography fontSize={13}>{`Tên KH: ${value.customer_name}`}</Typography>
          ) : null}
          {value.customer_phone ? (
            <Typography fontSize={13}>{`SĐT KH: ${value.customer_phone}`}</Typography>
          ) : null}
          {value.note ? (
            <Typography fontSize={13}>{`Ghi chú nội bộ: ${value.note}`}</Typography>
          ) : null}
          {value.delivery_note ? (
            <Typography fontSize={13}>{`Ghi chú vận đơn: ${value.delivery_note}`}</Typography>
          ) : null}
          {value.ecommerce_code ? (
            <Stack direction="row" alignItems="center" position="relative" width="fit-content">
              <CopyIconButton
                value={value.ecommerce_code}
                sx={styles.copyIconStyle}
                iconStyle={{ fontSize: 12 }}
              />
              <Link
                href={marketUrl}
                target="_blank"
                style={{ width: "fit-content", fontSize: 13 }}
              >{`Mã TMĐT: ${value.ecommerce_code}`}</Link>
            </Stack>
          ) : null}
          {value.customer_offline_code ? (
            <Typography fontSize={13}>{`Mã Offline: ${value.customer_offline_code}`}</Typography>
          ) : null}
          {value.source ? (
            <Typography fontSize={13}>{`Kênh bán hàng: ${value.source?.name}`}</Typography>
          ) : null}
          {value.tags?.length ? (
            <Typography fontSize={13}>{`Thẻ: ${value.tags?.join(", ")}`}</Typography>
          ) : (
            ""
          )}
        </Stack>
      );
    }

    // Vận đơn
  } else if (value.category === "SHIPPING") {
    category = "Vận chuyển";
    content = (
      <>
        {/* Trạng thái vận đơn */}
        {value.carrier_status ? (
          <Typography fontSize={13} fontWeight="bold">{`Trạng thái: ${
            find(optionStatusShipping, (current) => current.value === value.carrier_status)?.label
          }`}</Typography>
        ) : null}
        {value.finish_date ? (
          <Typography fontSize={13}>{`Ngày hoàn thành: ${fDate(value.finish_date)}`}</Typography>
        ) : null}
        {/* Người tạo */}
        {value?.history_action === HISTORY_ACTIONS.CREATE && shipping?.created_by ? (
          <Typography fontSize={13}>{`Người tạo: ${shipping?.created_by?.name}`}</Typography>
        ) : null}
        {/* Trạng thái vận đơn */}
        {value.cod_transfer_date ? (
          <Typography fontSize={13}>{`Trạng thái thu hộ: Đã thu COD`}</Typography>
        ) : null}

        {/* Đơn vị vận chuyển */}
        {value?.delivery_company_type ? (
          <Typography fontSize={13}>{`Đơn vị vận chuyển: ${
            find(TYPE_SHIPPING_COMPANIES, (item) => item.value === value?.delivery_company_type)
              ?.label
          }`}</Typography>
        ) : null}
        {/* Mã vận đơn */}
        {value.tracking_number ? (
          <Typography fontSize={13}>
            {`Mã vận đơn: `}
            <Link
              href={deliveryCodeUrl({
                deliveryType: shipping?.delivery_company_type,
                trackingNumber: value.tracking_number,
                source,
              })}
              style={{ width: "fit-content", fontSize: 13 }}
              target="_blank"
              rel="noreferrer"
            >
              {value.tracking_number}
            </Link>
          </Typography>
        ) : null}

        {value.carrier_status_system ? (
          <Typography fontSize={13}>{`Trạng thái giao hàng 3rd: ${
            find(optionStatusShipping, (current) => current.value === value.carrier_status_system)
              ?.label
          }`}</Typography>
        ) : null}

        {value.history_action === HISTORY_ACTIONS.CREATE
          ? sheets?.map((item) => (
              <Box key={item.code}>
                {item?.type ? (
                  <Typography fontSize={13}>
                    {`Mã kho: `}
                    <Link
                      href={`/${STATUS_ROLE_WAREHOUSE.SHEET}/${item?.id}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ width: "fit-content", fontSize: 13 }}
                    >
                      {item?.code}
                    </Link>
                  </Typography>
                ) : null}
              </Box>
            ))
          : null}
      </>
    );

    // Thanh toán
  } else if (value.category === "PAYMENT") {
    category = "Thanh toán";
    content = (
      <>
        {value.confirmed_date ? (
          <Typography fontSize={13} fontWeight="bold">{`Trạng thái: Xác nhận`}</Typography>
        ) : null}
        <Typography
          style={{ cursor: isShowPayment ? "pointer" : "auto" }}
          sx={{
            color: isShowPayment ? "secondary.main" : "#637381",
            fontSize: 13,
            width: "fit-content",
          }}
          onClick={isShowPayment ? () => setIsPaymentOpen(true) : undefined}
        >
          {`Chi tiết thanh toán >>>`}
        </Typography>
        {isShowPayment ? (
          <PaymentDetailPopup
            open={isPaymentModalOpen}
            onClose={() => setIsPaymentOpen(false)}
            payments={payments || []}
            onRefresh={handleRefresh}
          />
        ) : null}
        {value.amount ? (
          <Typography fontSize={13}>{`Số tiền thanh toán: ${fNumber(value.amount)}`}</Typography>
        ) : null}
        {value.type ? (
          <Typography fontSize={13}>{`PTTT: ${
            PAYMENT_TYPE_VALUES.find((item) => item.value === value.type)?.label
          }`}</Typography>
        ) : null}
      </>
    );

    // Kho
  } else if (value.category === "WAREHOUSE") {
    category = "Kho";
    content = (
      <>
        {value.is_confirm && (
          <Typography fontSize={13} fontWeight="bold">{`Trạng thái: Xác nhận`}</Typography>
        )}
        {value.confirmed_by && (
          <Typography fontSize={13}>{`Người xác nhận: ${value.confirmed_by?.name}`}</Typography>
        )}
        {value?.type ? (
          <Typography fontSize={13}>
            {`Mã kho: `}
            <Link
              href={`/${STATUS_ROLE_WAREHOUSE.SHEET}/${value?.id}`}
              target="_blank"
              rel="noreferrer"
              style={{ width: "fit-content", fontSize: 13 }}
            >
              {value?.code}
            </Link>
          </Typography>
        ) : null}
        {value.sheet_reason ? (
          <Typography fontSize={13}>{`Lý do: ${value.sheet_reason.name}`}</Typography>
        ) : null}
      </>
    );
  }

  if (value.history_date) {
    return (
      <TimelineItem>
        <TimelineOppositeContent color="text.secondary">
          <Typography fontSize={14}>
            {value.history_action === HISTORY_ACTIONS.CREATE && `Tạo`}
            {value.history_action === HISTORY_ACTIONS.UPDATE && `Cập nhật`}
            {value.history_action === HISTORY_ACTIONS.CONFIRM && `Xác nhận`}
            {value.history_action === HISTORY_ACTIONS.PRINT && `In`}
            {value.history_action === HISTORY_ACTIONS.CANCEL && `Huỷ`}
          </Typography>
          <Typography color="primary.main" fontWeight={"bold"} fontSize={14}>
            {category}
          </Typography>
          <Typography fontSize={13}>{fDateTime(value.history_date)}</Typography>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>{content}</TimelineContent>
      </TimelineItem>
    );
  }
  return null;
};

export default HistoryItem;

const styled = (theme: Theme): { [key: string]: SxProps<Theme> } => {
  return {
    info: {
      fontWeight: 600,
      fontSize: 13,
      display: "inline",
    },
    copyIconStyle: {
      position: "absolute",
      top: -12,
      right: -16,
      cursor: "pointer",
      color: theme.palette.primary.main,
      "&:hover": {
        color: theme.palette.primary.dark,
        transition: "all .15s ease-in-out",
      },
      svg: {
        width: 15,
        height: 15,
      },
    },
  };
};
