//types
import {
  OrderFormType,
  OrderPaymentType,
  OrderPaymentTypeV2,
  OrderPaymentTypeValue,
} from "_types_/OrderType";
import { FieldErrors } from "react-hook-form";

//utils
import map from "lodash/map";
import { PAYMENT_TYPE_VALUES } from "views/OrderView/constants/options";

//components
import Grid from "@mui/material/Grid";
import { LabelInfo } from "components/Labels";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import { InputNumber } from "components/Fields";
import FormHelperText from "@mui/material/FormHelperText";
import Typography from "@mui/material/Typography";

//hooks
import { memo } from "react";

//icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const PaymentType = ({
  onChange,
  payments,
  isEdit,
  payment,
  errors,
}: {
  payments: Partial<OrderPaymentTypeV2>[];
  onChange: (value: Partial<OrderPaymentTypeV2>[]) => void;
  isEdit?: boolean;
  payment?: Partial<OrderPaymentType>;
  errors: FieldErrors<OrderFormType>;
}) => {
  return (
    <Grid container display="flex" alignItems="center" spacing={1}>
      <Grid item xs={6}>
        <LabelInfo>Phương thức thanh toán</LabelInfo>
        <FormHelperText error>
          {(errors.payments as { message: string } | undefined)?.message}
        </FormHelperText>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Stack>
          {payment?.total_actual === 0 ? (
            <Typography fontSize={14}>Thanh toán khi nhận hàng</Typography>
          ) : (
            map(PAYMENT_TYPE_VALUES, (item, index) => (
              <PaymentTypeItem
                key={index}
                item={item}
                disabled={!isEdit}
                payments={payments}
                onChange={onChange}
                payment={payment}
              />
            ))
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default memo(PaymentType);

const PaymentTypeItem = ({
  item,
  disabled,
  payments = [],
  onChange,
  payment,
}: {
  item: {
    label: string;
    value: OrderPaymentTypeValue;
  };
  disabled?: boolean;
  payments: Partial<OrderPaymentTypeV2>[];
  onChange: (value: Partial<OrderPaymentTypeV2>[]) => void;
  payment?: Partial<OrderPaymentType>;
}) => {
  const paymentIdx = payments.findIndex((pm) => {
    return pm.type === item.value;
  });

  const stableType = payments.find((item) => item.type === "COD" || item.type === "CASH");

  const handleTooglePaymentType = ({
    isChecked,
    type,
  }: {
    isChecked?: boolean;
    type: OrderPaymentTypeValue;
  }) => {
    const paymentsClone = [...payments];
    if (isChecked) {
      const { cost = 0 } = payment || {};
      onChange([...paymentsClone, { type, amount: cost }]);
    } else {
      paymentsClone.splice(paymentIdx, 1);
      onChange(paymentsClone);
    }
  };

  // khi phương thức chưa được chọn (chưa có amount) mà số tiền phải trả = 0
  // thì không cần chọn phương thức (trả về null/ không show ra)
  if (!payments[paymentIdx]?.amount && payment?.cost === 0) {
    return null;
  }

  return !!stableType && paymentIdx < 0 ? null : (
    <Stack>
      <FormControlLabel
        sx={{ ".MuiFormControlLabel-label": { fontWeight: 500, fontSize: 13 } }}
        control={
          payments[paymentIdx]?.is_confirmed ? (
            <CheckCircleIcon sx={{ color: "success.main", m: 1 }} />
          ) : (
            <Checkbox
              onChange={(e) =>
                handleTooglePaymentType({ isChecked: e.target.checked, type: item.value })
              }
              checked={paymentIdx >= 0}
            />
          )
        }
        label={item.label}
        style={{ marginRight: 0 }}
        disabled={disabled}
      />

      {/* input nhập số tiền cho phương thức chuyển khoản */}
      {paymentIdx >= 0 && item.value === "DIRECT_TRANSFER" && (
        <InputNumber
          containerStyles={{ input: { textAlign: "end", paddingRight: "0px !important" } }}
          value={payments[paymentIdx]?.amount}
          onChange={(value) => onChange([{ type: item.value, amount: value }])}
          type="currency"
          disabled={disabled}
        />
      )}
    </Stack>
  );
};
