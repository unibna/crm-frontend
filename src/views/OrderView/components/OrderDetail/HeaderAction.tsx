//components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Shipping from "../Shipping";

//types
import { OrderFormType, OrderStatusValue } from "_types_/OrderType";
import { OrderContext } from "views/OrderView";

//utils
import vi from "locales/vi.json";
import { ROLE_TAB, STATUS_ROLE_ORDERS } from "constants/rolesTab";
import { isMatchRoles, isReadAndWriteRole } from "utils/roleUtils";

//hooks
import { orderApi } from "_apis_/order.api";
import { AttributeType } from "_types_/AttributeType";
import useAuth from "hooks/useAuth";
import { useCallback, useContext, useEffect, useState } from "react";
import { dispatch } from "store";
import { toastError } from "store/redux/toast/slice";
import CancelReasonCofirmPopover from "./CancelReasonConfirmPopover";

const HeaderAction = ({
  handleUpdateOrder,
  handlePrintOrder,
  isShowCancelButton,
  isShowShippingButton,
  isShowPrintButton,
  isFullPage,
  handleReloadOrder,
  onFullPage,
  row,
  cancelDisabled,
}: {
  handleUpdateOrder: (order: {
    status: OrderStatusValue;
    cancel_reason: number | AttributeType;
  }) => void;
  handlePrintOrder: () => void;
  isShowCancelButton?: boolean;
  isShowShippingButton?: boolean;
  isShowPrintButton?: boolean;
  isFullPage?: boolean;
  handleReloadOrder?: () => void;
  onFullPage?: () => void;
  row?: OrderFormType;
  cancelDisabled?: boolean;
}) => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [cancelReasons, setCancelReasons] = useState<{ id: number; name: string }[]>([]);
  const orderContext = useContext(OrderContext);

  const getCancelReasons = useCallback(async () => {
    if (orderContext?.cancelReasons) {
      setCancelReasons(orderContext.cancelReasons);
      return;
    }
    const result = await orderApi.get<{ id: number; name: string }>({
      endpoint: "cancel_reason/",
      params: { limit: 200, page: 1 },
    });
    if (result?.data) {
      setCancelReasons(result.data.results);
    }
  }, [orderContext?.cancelReasons]);

  const printRole = isMatchRoles(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.PRINT]
  );

  const isEdit = row?.order_key === vi.duplidate;

  const isOwner = user?.id === row?.created_by?.id;
  const isCancelRole =
    isReadAndWriteRole(
      user?.is_superuser,
      user?.group_permission?.data?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.CANCEL]
    ) ||
    (isOwner &&
      isMatchRoles(
        user?.is_superuser,
        user?.group_permission?.data?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.HANDLE]
      ));

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!isCancelRole) {
      dispatch(toastError({ message: "Bạn không có quyền huỷ đơn" }));
      return;
    }
    setAnchorEl(e.currentTarget);
  };

  useEffect(() => {
    getCancelReasons();
  }, [getCancelReasons]);

  return (
    <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
      {isShowCancelButton && !isEdit && (
        <>
          <Button
            variant="outlined"
            color="error"
            onClick={handleCancel}
            sx={{ width: 110, my: 2 }}
            disabled={cancelDisabled}
          >
            Huỷ đơn
          </Button>
          <CancelReasonCofirmPopover
            cancelReasons={cancelReasons}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            loading={false}
            handleSubmit={(cancelReasonId) => {
              handleUpdateOrder({ status: "cancel", cancel_reason: cancelReasonId });
            }}
          />
        </>
      )}

      {isShowPrintButton && !isEdit && (
        <Button variant="outlined" onClick={handlePrintOrder} sx={{ my: 2 }}>
          In đơn
        </Button>
      )}
      {onFullPage && !isEdit && printRole && (
        <Button variant="outlined" onClick={onFullPage} sx={{ my: 2 }}>
          {isFullPage ? "Đóng Full page" : "Full page"}
        </Button>
      )}
      {isShowShippingButton && !isEdit && (
        <Box my={2}>
          <Shipping dataRow={row} handleReloadOrder={handleReloadOrder} />
        </Box>
      )}
    </Stack>
  );
};

export default HeaderAction;
