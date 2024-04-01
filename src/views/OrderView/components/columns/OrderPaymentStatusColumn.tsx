//components
import { DataTypeProvider, FilterOperation } from "@devexpress/dx-react-grid";
import { MTextLine, Span } from "components/Labels";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { TextInfo } from "components/Labels";
import PaymentDetailPopup from "../PaymentDetailPopup";
import { SxProps, Theme } from "@mui/material";

//types
import { OrderPaymentTypeV2, OrderType } from "_types_/OrderType";

//utils
import { fNumber } from "utils/formatNumber";
import { isMatchRoles } from "utils/roleUtils";
import { ORDER_PAYMENT_TYPE } from "views/OrderView/constants";
import { ROLE_TAB, STATUS_ROLE_ORDERS } from "constants/rolesTab";

//hooks
import { useState } from "react";
import useAuth from "hooks/useAuth";

interface Props {
  for: Array<string>;
  /** A component that renders the formatted value?. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations that are available for the associated columns. */
  availableFilterOperations?: Array<FilterOperation>;

  onRefresh?: () => void;
}

export const OrderPaymentStatusColumn = (props: Props) => {
  const Formatter = ({ value, row }: { value: Partial<OrderPaymentTypeV2>[]; row?: OrderType }) => {
    const [open, setIsOpen] = useState(false);
    const { user } = useAuth();
    const isShowPayment = isMatchRoles(user?.is_superuser,
      user?.group_permission?.data?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.PAYMENT]
    );

    const styles: SxProps<Theme> = {
      chip: {
        width: "fit-content",
        lineHeight: "150%",
        height: "auto",
        padding: "4px 8px",
      },
      textButton: {
        fontSize: 13,
        color: "secondary.main",
        cursor: "pointer",
        "&:hover": {
          textDecoration: "underline",
        },
      },
    };

    return (
      <>
        <PaymentDetailPopup
          open={open}
          onClose={() => setIsOpen(false)}
          payments={row?.payments || []}
          orderID={row?.id}
          onRefresh={props.onRefresh}
        />
        <Stack direction="column" spacing={1} sx={{ width: 260 }}>
          <MTextLine
            containerStyle={{ ml: 0 }}
            label="Thanh toán:"
            value={
              <>
                {row?.payments?.length ? (
                  <Stack direction="column" spacing={1}>
                    {row?.payments?.map((item, index: number) => {
                      const { id, confirmed_date } = item;
                      return (
                        <Box key={`${id}${confirmed_date}`}>
                          {item?.amount && item.type ? (
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Span color={ORDER_PAYMENT_TYPE[item.type].color} sx={styles.chip}>
                                {`${ORDER_PAYMENT_TYPE[item.type].value}` || ""}:
                              </Span>
                              {item.is_confirmed ? (
                                <Span
                                  color={item.amount !== item.actual_amount ? "error" : "success"}
                                  sx={styles.chip}
                                  key={index}
                                >
                                  {fNumber(item.amount)}
                                </Span>
                              ) : (
                                <TextInfo sx={{ fontSize: 13, backgroundColor: "transparent" }}>
                                  {fNumber(item.amount)}
                                </TextInfo>
                              )}
                            </Stack>
                          ) : null}
                        </Box>
                      );
                    })}
                  </Stack>
                ) : (
                  "---"
                )}
              </>
            }
            xsLabel={5}
            xsValue={7}
          />
          {isShowPayment && (
            <Typography sx={styles.textButton} onClick={() => setIsOpen(true)}>
              {"Chi tiết thanh toán >>"}
            </Typography>
          )}
        </Stack>
      </>
    );
  };
  return <DataTypeProvider formatterComponent={Formatter} {...props} />;
};
