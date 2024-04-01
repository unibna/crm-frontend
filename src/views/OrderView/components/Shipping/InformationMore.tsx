// Libraries
import { useMemo } from "react";
import find from "lodash/find";
import { UseFormReturn } from "react-hook-form";

// Components
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

// Types
import { FormValuesProps } from "components/Popups/FormPopup";

// Constants & Utils
import { COMMAS_REGEX } from "constants/index";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

// ---------------------------------------------------

interface Props extends UseFormReturn<FormValuesProps, object> {}

const InformationMore = (props: Props) => {
  const { watch } = props;
  const { customer, addressReceived, payment, shippingCompanies, addressSend } = watch();

  const formatValue = (value: number) => {
    return `${Math.trunc(value)?.toString().replace(COMMAS_REGEX, ",") || 0} đ`;
  };

  const directTransfer = useMemo(() => {
    return find(payment.payments, (item) => item.type === "DIRECT_TRANSFER")?.amount || 0;
  }, []);

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Bên gửi" />
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            {addressSend?.name}&nbsp;
          </Typography>

          <Typography variant="body2" gutterBottom>
            {getObjectPropSafely(() => addressSend.address.address)}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {addressSend?.manager_phone}
          </Typography>
          {!Object.values(addressSend).length ? (
            <Typography sx={{ fontSize: 13, mt: 1 }} color="error">
              Không có địa chỉ gửi hàng
            </Typography>
          ) : null}
        </CardContent>
      </Card>
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Khách hàng" />
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            {`${customer?.full_name || ""}`}&nbsp;
          </Typography>

          <Typography variant="body2" gutterBottom>
            {addressReceived?.address}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {customer?.phone}
          </Typography>
          {!shippingCompanies.length ? (
            <Typography sx={{ fontSize: 13, mt: 1 }} color="error">
              Địa chỉ nhận không có công ty giao hàng
            </Typography>
          ) : null}
        </CardContent>
      </Card>
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Tổng đơn hàng" />

        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Tiền hàng (chưa KM)
              </Typography>
              <Typography variant="subtitle2">
                {formatValue(getObjectPropSafely(() => payment.total_variant_all) || 0)}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Tiền hàng (đã KM)
              </Typography>
              <Typography variant="subtitle2">
                {formatValue(getObjectPropSafely(() => payment.total_variant_actual) || 0)}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Khuyến mãi
              </Typography>
              <Typography variant="subtitle2">
                {formatValue(
                  (getObjectPropSafely(() => payment.discount_promotion) || 0) +
                    (getObjectPropSafely(() => payment.discount_input) || 0)
                )}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Phụ thu
              </Typography>
              <Typography variant="subtitle2">
                {formatValue(getObjectPropSafely(() => payment.fee_additional) || 0)}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Phí vận chuyển
              </Typography>
              <Typography variant="subtitle2">
                {formatValue(getObjectPropSafely(() => payment.fee_delivery) || 0)}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Ghi chú vận đơn
              </Typography>
              <Typography variant="subtitle2">
                {getObjectPropSafely(() => payment.delivery_note) || ""}
              </Typography>
            </Stack>

            <Divider />

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle2">Tổng tiền</Typography>
              <Typography variant="subtitle2">
                {formatValue(getObjectPropSafely(() => payment.total_actual) || 0)}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle2">Đã thanh toán</Typography>
              <Typography variant="subtitle2">
                {formatValue(getObjectPropSafely(() => directTransfer) || 0)}
              </Typography>
            </Stack>

            <Divider />

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle1">Tồng tiền phải thu</Typography>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="subtitle1" sx={{ color: "error.main" }}>
                  {formatValue(getObjectPropSafely(() => payment.cost) || 0)}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default InformationMore;
