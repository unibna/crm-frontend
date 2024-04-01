import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import { useState } from "react";
import { PaymentEditType } from "./PaymentEditColumn";

export function PaymentConfirmColumn({
  disabled,
  defaultValue,
  handleUpdatePayment,
  payments,
  setPayments,
  index,
}: {
  disabled?: boolean;
  defaultValue?: any;
  handleUpdatePayment: any;
  payments: any;
  setPayments: any;
  index: number;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <>
      {loading ? (
        <CircularProgress color="primary" size="small" />
      ) : (
        <>
          <Switch
            disabled={disabled}
            checked={defaultValue.is_confirmed}
            onChange={(event) => {
              handleUpdatePayment(
                {
                  is_confirmed: event.target.checked,
                },
                (result: Partial<PaymentEditType>) => {
                  const newData = [...payments];
                  newData[index] = {
                    ...newData[index],
                    ...result,
                  };
                  setPayments(newData);
                },
                setLoading
              );
            }}
          />
        </>
      )}
    </>
  );
}
