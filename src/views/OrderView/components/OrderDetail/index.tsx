import { yupResolver } from "@hookform/resolvers/yup";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import { deliveryApi } from "_apis_/delivery.api";
import { orderApi } from "_apis_/order.api";
import {
  OrderDTO,
  OrderFormType,
  OrderPaymentType,
  OrderPaymentTypeV2,
  OrderType,
} from "_types_/OrderType";
import { AttributeVariant } from "_types_/ProductType";
import { ShippingStatusValue } from "_types_/ShippingType";
import { SX_PADDING_FORM_FULL_WIDTH_MODAL } from "constants/index";
import { ROLE_TAB, STATUS_ROLE_ORDERS } from "constants/rolesTab";
import { handleSyncOrderFromMarketplace } from "features/order/handleSyncOrderFromMarketplace";
import { useAppDispatch, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { useCancelToken } from "hooks/useCancelToken";
import { useDidUpdateEffect } from "hooks/useDidUpdateEffect";
import useIsMountedRef from "hooks/useIsMountedRef";
import usePopup from "hooks/usePopup";
import vi from "locales/vi.json";
import isEqual from "lodash/isEqual";
import omit from "lodash/omit";
import pick from "lodash/pick";
import { memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { leadStore } from "store/redux/leads/slice";
import { toastError, toastInfo } from "store/redux/toast/slice";
import { isMatchRoles, isReadAndWriteRole } from "utils/roleUtils";
import { toSimplest } from "utils/stringsUtil";
import { OrderContext } from "views/OrderView";
import { ORDER_FORM_SCHEMA } from "views/OrderView/constants";
import { handleCheckInventory } from "features/order/handleCheckInventory";
import OrderPrintModal from "../OrderPrintModal";
import BottomPanel, { BottomPanelProps } from "./BottomPanel";
import ConfirmVariantModal from "./ConfirmVariantModal";
import Customer from "./Customer";
import General from "./General";
import HeaderAction from "./HeaderAction";
import HeaderPanel from "./HeaderPanel";
import OrderHistoryTimeline from "./OrderHistoryTimeline";
import OrderVariant from "./OrderVariant";
import Payment from "./Payment";
import { formatOrderDataToForm, formatOrderDataToRequestParams } from "features/order/formatData";

interface Props extends BottomPanelProps {
  onApplyChanges?: (value: Partial<OrderFormType>) => void;
  open: boolean;
  submitText?: string;
  isPage?: boolean;
  defaultValue?: Partial<OrderType>;
  directionAfterAlternatived?: boolean;
  onFullPage?: () => void;
  isFullPage?: boolean;
  row?: Partial<OrderType>;
}

let orderDefault: OrderFormType | undefined = undefined;
let isReloadDataAfterClose = false;
let isSyncLineItems = false;

const OrderDetail = ({
  open = false,
  onApplyChanges,
  onClose,
  isPage,
  defaultValue,
  directionAfterAlternatived = true,
  onFullPage,
  isFullPage,
  row,
}: Omit<Props, "id" | "loading" | "onSubmit" | "orderKey" | "submitDisabled" | "submitText">) => {
  const isMounted = useIsMountedRef();
  const { user } = useAuth();
  const leadSlice = useAppSelector(leadStore);
  const orderContext = useContext(OrderContext);
  const [isShowPrintModal, setShowPrintModal] = useState(false);
  const [orderDetail, setOrderDetail] = useState<{
    orders: OrderType[];
    loading: boolean;
    total: number;
  }>({
    orders: [],
    loading: false,
    total: 0,
  });
  const { isSubmit } = usePopup<any>();
  const { newCancelToken } = useCancelToken();
  const navigate = useNavigate();
  const [isConfirmModal, setIsConfirmModal] = useState(false);

  const { reset, clearErrors, getValues, setValue, handleSubmit, formState, watch } =
    useForm<OrderFormType>({
      resolver: yupResolver(ORDER_FORM_SCHEMA),
      mode: "all",
      defaultValues: { status: "completed" },
    });

  const formStateResult = formState;
  const errors = formStateResult.errors;

  //prettier-ignore
  const { source, shipping, order_key, payments, line_items, promotions, payment, shipping_address, is_ecommerce_source, customer, created_by, ecommerce_code } = watch();

  const { isDenyConfirm, totalQuantity } = useMemo(
    () => handleCheckInventory(line_items),
    [line_items]
  );

  const dispatch = useAppDispatch();

  const handlePrintOrder = () => {
    setShowPrintModal(!isShowPrintModal);
  };

  const handleUpdateOrder = async (order: Partial<OrderDTO>) => {
    setOrderDetail((prev) => ({ ...prev, loading: true }));

    const body = pick(order, [
      "cancel_reason",
      "customer",
      "tags",
      "note",
      "delivery_note",
      "source",
      "status",
      "payments",
      "cost",
      "shipping_address",
      "cross_sale_amount",
      "is_cross_sale",
      "appointment_date",
      "customer_name",
      "ecommerce_code",
      "customer_offline_code",
    ]);

    const result = await orderApi.update<OrderType>({
      params: body,
      endpoint: `${row?.id}/`,
    });
    if (result?.data) {
      if (result.data.status !== orderDefault?.status) {
        orderContext?.getStatusAmount();
      }
      onApplyChanges?.(result.data as OrderFormType);
      if (directionAfterAlternatived) {
        directionOrderTabByOrderStatus(result.data);
      } else {
        onClose?.();
      }
    }
    setOrderDetail((prev) => ({ ...prev, loading: false }));
  };

  const directionOrderTabByOrderStatus = (order: Partial<OrderType>) => {
    if (orderDefault?.status !== order.status) {
      navigate(`/orders/list/${order.status}`);
    }
  };

  const handleCreateOrder = async (order: Partial<OrderDTO>) => {
    setOrderDetail((prev) => ({ ...prev, loading: true }));

    const result = await orderApi.create<OrderType>({
      params: order,
      endpoint: "",
    });
    if (result?.data) {
      orderContext?.getStatusAmount();
      onApplyChanges?.(result.data);
      onClose?.();

      if (directionAfterAlternatived) {
        directionOrderTabByOrderStatus(result.data);
      }
    }
    setOrderDetail((prev) => ({ ...prev, loading: false }));
  };

  /**
   * Handle duplicate order
   * @param order - Partial order alteration type
   */
  const handleDuplicateOrder = async (order: Partial<OrderDTO>) => {
    setOrderDetail((prev) => ({ ...prev, loading: true }));

    const body: Partial<OrderDTO> = {
      ...order,
      status: order.status === "completed" ? "completed" : "draft",
    };

    const result = await orderApi.create<OrderType>({ params: body, endpoint: "" });
    if (result?.data) {
      dispatch(toastInfo({ message: `Mã đơn vừa tạo: ${result.data.order_key}` }));
      onApplyChanges?.(result?.data);
      if (directionAfterAlternatived) {
        directionOrderTabByOrderStatus(result?.data);
      } else {
        onClose?.();
      }
    }
    setOrderDetail((prev) => ({ ...prev, loading: false }));
  };

  /**
   * Synchronize order from marketplace
   * @param {string} id - The order ID
   * @param {string} sourceName - The source name of the marketplace
   * @param {string} ecommerceCode - The ecommerce code of the marketplace
   */
  const syncOrderFromMarketplace = useCallback(
    async ({ sourceName, ecommerceCode }: { sourceName?: string; ecommerceCode?: string }) => {
      isSyncLineItems = true;
      setOrderDetail((prev) => ({ ...prev, loading: true }));
      const { isSyncSuccess } = await handleSyncOrderFromMarketplace({ ecommerceCode, sourceName });
      setOrderDetail((prev) => ({ ...prev, loading: false }));
      return { isSyncSuccess };
    },
    []
  );

  const getOrderByID = useCallback(async () => {
    setOrderDetail((prev) => ({ ...prev, loading: true }));

    const resOrder = await orderApi.getId<OrderType>({
      endpoint: `${row?.id}/`,
      params: { cancelToken: newCancelToken() },
    });
    if (resOrder?.data) {
      isMounted.current && setOrderDetail((prev) => ({ ...prev, orders: [resOrder?.data?.data] }));
      let orderFormData = formatOrderDataToForm(resOrder?.data?.data);

      const channel = leadSlice.attributes.channel.find(
        (item) => item.id.toString() === orderFormData?.source?.id.toString()
      );
      // nếu source là kênh thương mại điện tử thì show input thương mại điện tử
      const isEcommerceSource = channel?.is_e_commerce;
      const isOfflineChannel = channel?.name === "Offline";

      orderFormData = {
        ...orderFormData,
        is_ecommerce_source: isEcommerceSource,
        is_offline_channel: isOfflineChannel,
      };

      if (!orderFormData.line_items.length && !isSyncLineItems) {
        const { isSyncSuccess } = await syncOrderFromMarketplace({
          sourceName: orderFormData.source?.name,
          ecommerceCode: orderFormData.ecommerce_code,
        });
        isSyncSuccess && getOrderByID();
      }

      orderDefault = orderFormData;
      handleCheckInventory(orderFormData.line_items);

      isMounted.current && reset(orderFormData);
    }
    setOrderDetail((prev) => ({ ...prev, loading: false }));
  }, [
    isMounted,
    leadSlice.attributes.channel,
    newCancelToken,
    reset,
    row?.id,
    syncOrderFromMarketplace,
  ]);

  const handleChangeLineItems = (variants: AttributeVariant[]) => {
    const { crossSaleValue, isDenyConfirm, isCrossSale } = handleCheckInventory(variants);
    // cập nhật lại crosssale value
    setValue<keyof OrderFormType>("is_cross_sale", isCrossSale);
    setValue<keyof OrderFormType>("cross_sale_amount", crossSaleValue);
    //khi cập nhật sản phẩm mà kho không có hàng thì set đơn lại thành đơn hẹn
    isDenyConfirm && setValue<keyof OrderFormType>("status", "draft");
    setValue<keyof OrderFormType>("line_items", variants, { shouldValidate: true });
  };

  const handleChangeShipping = useCallback(async () => {
    const address = customer?.shipping_addresses?.find((item) => {
      return item?.id === shipping_address?.id;
    });
    //kiểm tra sự hỗ trợ của bên giao hàng với địa chỉ vừa thay đổi
    if (address) {
      setOrderDetail((prev) => ({ ...prev, loading: true }));

      const result = await deliveryApi.get(
        {},
        `available_company/locations/${address?.location?.ward_id}/`
      );
      isMounted.current &&
        setValue<keyof OrderFormType>("is_available_shipping", result.data ? true : false, {
          shouldValidate: true,
        });
      setOrderDetail((prev) => ({ ...prev, loading: false }));
    }
  }, [customer?.shipping_addresses, isMounted, setValue, shipping_address?.id]);

  const handleNotifyErrors = useCallback(() => {
    const errorKey = Object.keys(errors)[0] as keyof typeof errors;
    const error = errors[errorKey] as any;
    if (Object.keys(errors).length > 0) {
      dispatch(
        toastError({
          message: error?.id ? error?.id?.message : error?.message,
        })
      );
    }
  }, [dispatch, errors]);

  // show modal confirm variant
  const handleConfirmForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // với đơn sao chép hoặc đơn tạo
    if (isDuplidateOrderState || !row?.id) {
      handleSubmit(() => setIsConfirmModal((prev) => !prev))(e);
    } else {
      handleSubmitForm(e);
    }
  };

  const handleSubmitForm = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setIsConfirmModal(false);
    await handleSubmit(handleFormatBodyOrder)(e);
  };

  const handleCloseModal = () => {
    isReloadDataAfterClose ? onApplyChanges?.(getValues()) : onClose?.();
  };

  const handleFormatBodyOrder = async (form: OrderFormType) => {
    const orderRequestParams = formatOrderDataToRequestParams({
      form,
      user,
      defaultStatus: orderDefault?.status,
    });
    if (orderRequestParams) {
      row?.id
        ? isDuplidateOrderState
          ? handleDuplicateOrder(orderRequestParams)
          : handleUpdateOrder(orderRequestParams)
        : handleCreateOrder(orderRequestParams);
    }
  };

  const handleChangePayment = (value: OrderPaymentType) => {
    // set payment ( chi tiết thanh toán )
    setValue<keyof OrderFormType>("payment", value, { shouldValidate: true });
    setValue<keyof OrderFormType>("promotions", undefined, { shouldValidate: true });

    const newPayments: OrderPaymentTypeV2[] | undefined = !value?.total_actual
      ? [{ type: "COD", amount: 0 }]
      : undefined;
    // set payments (phương thức/ trạng thái thanh toán)
    setValue<keyof OrderFormType>("payments", newPayments, { shouldValidate: true });
  };

  const onRefreshLineItems = async () => {
    const { isSyncSuccess } = await syncOrderFromMarketplace({
      sourceName: source?.name,
      ecommerceCode: ecommerce_code,
    });
    isSyncSuccess && getOrderByID();
  };

  useEffect(() => {
    clearErrors();
    if (open) {
      if (row?.id) {
        getOrderByID();
      }
      orderDefault = undefined;
      isMounted.current && reset(defaultValue);
    } else {
      isSyncLineItems = false;
      orderDefault = undefined;
      isReloadDataAfterClose = false;
      reset({});
    }
  }, [open, clearErrors, defaultValue, getOrderByID, isMounted, reset, row?.id]);

  useDidUpdateEffect(() => {
    if (isSubmit) {
      getOrderByID();
    }
  }, [isSubmit]);

  useEffect(() => {
    handleNotifyErrors();
  }, [handleNotifyErrors]);

  useEffect(() => {
    if (shipping_address?.id) {
      handleChangeShipping();
    }
  }, [shipping_address?.id, handleChangeShipping]);

  const isShippingRole = isMatchRoles(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.SHIPPING]
  );

  // chưa tạo đơn hàng hoặc đã tạo đơn nhưng form đang ở trạng thái sao chép
  const isDuplidateOrderState = order_key === vi.duplidate;
  const isEdit = !row?.id || isDuplidateOrderState;

  //đơn đang nháp hoặc đã xác nhận nhưng chưa giao hàng thì vẫn cho huỷ
  const isShowCancelButton =
    orderDefault?.status === "draft" || // trạng thái đơn là nháp
    (orderDefault?.status === "completed" && // hoặc trạng thái đơn là hoàn thành và
      (!shipping || // không có shipping hoặc
        (shipping?.carrier_status === ShippingStatusValue.WAITING_FOR_DELIVERY && // có shipping có trạng thái chờ giao hàng
          // và có quyền shipping
          isShippingRole)));

  const isShowShippingButton =
    !!row?.id && orderDefault?.status === "completed" && !shipping && isShippingRole;

  const formLoading = !!row?.id && Object.keys(getValues()).length === 4;

  const headerPageTitle = order_key ? `Chi tiết đơn - ${order_key || ""}` : "Chi tiết đơn";

  const headerDrawerTitle = !!row?.id
    ? order_key
      ? `Cập nhật đơn ${order_key}`
      : "Cập nhật đơn"
    : "Thêm đơn";

  /* 
    kiểm tra xem người dùng hiện tại có quyền kiểm soát trạng thái đơn đặt hàng cụ thể hay không. 
    hàm `isReadAndWriteRole` để kiểm tra quyền của user
    kiểm tra xem ID của người dùng hiện tại có khớp với ID của người tạo hay không 
    hoặc liệu đối tượng `row` không có ID.  
    */
  const isMasterHandle = isReadAndWriteRole(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.HANDLE]
  );
  const isOwner = user?.id === row?.created_by?.id;
  const isNewOrder = !row?.id;
  const isControl = isMasterHandle || isOwner || isNewOrder;

  const isCancelStatus = orderDefault?.status === "cancel" && !isDuplidateOrderState;
  const isOriginData = isEqual(orderDefault, omit(getValues(), ["is_available_shipping"]));

  const isSystemEcommerceSource =
    toSimplest(source?.name).includes("system") && is_ecommerce_source;

  /* không cho submit order khi
      - !isMasterHandle không có quyền
      - !isOwner không phải là người tạo order
      - isNewOrder khi đơn đã được tạo
      - isCancelStatus là đơn huỷ
      - isOriginData dữ liệu không thay đổi
    */
  const disabledSubmit = isCancelStatus || isOriginData;
  const isPrintControl = isMatchRoles(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.PRINT]
  );

  const isShipping = !!row?.id && shipping && shipping?.shipping_status !== "picking";
  const isCompleted = !line_items?.length || orderDefault?.status === "completed";

  return (
    <>
      <OrderPrintModal
        open={isShowPrintModal}
        loading={orderDetail.loading}
        setOpen={setShowPrintModal}
        selection={[0]}
        data={orderDetail.orders}
      />

      <ConfirmVariantModal
        totalQuantity={totalQuantity}
        open={isConfirmModal}
        setOpen={setIsConfirmModal}
        lineItems={line_items}
        onSubmit={handleSubmitForm}
        loading={orderDetail.loading}
        isDenyConfirm={isDenyConfirm}
      />

      <HeaderPanel
        onClose={isPage ? undefined : handleCloseModal}
        title={isPage ? headerPageTitle : headerDrawerTitle}
        isPage={isPage}
      />
      <Divider />
      <DialogContent
        sx={{ padding: isPage ? 1 : "auto", px: isPage ? 1 : SX_PADDING_FORM_FULL_WIDTH_MODAL }}
      >
        {!!row?.id && (
          <HeaderAction
            isShowCancelButton={isShowCancelButton}
            isShowShippingButton={isControl && isShowShippingButton}
            isShowPrintButton={isPrintControl}
            handleUpdateOrder={handleUpdateOrder}
            handlePrintOrder={handlePrintOrder}
            handleReloadOrder={() => {
              isReloadDataAfterClose = true;
            }}
            row={getValues()}
            onFullPage={onFullPage}
            isFullPage={isFullPage}
            cancelDisabled={isSystemEcommerceSource}
          />
        )}
        {orderDetail.loading && <LinearProgress sx={{ mb: 0.5 }} />}
        <Grid container spacing={2}>
          <Grid item xs={12} lg={9}>
            <OrderVariant
              isSearch={isEdit}
              errors={errors}
              line_items={line_items || []}
              onChangeLineItems={handleChangeLineItems}
              onChangePayment={handleChangePayment}
              payment={payment}
              loading={formLoading || !open} // length key of default form
              onRefreshLineItems={!!ecommerce_code ? onRefreshLineItems : undefined}
            />
            <Payment
              orderID={row?.id}
              onChangePayment={(value) => setValue("payment", value, { shouldValidate: true })}
              onChangePaymentType={(value) => setValue("payments", value, { shouldValidate: true })}
              onChangePromotion={(value) => setValue("promotions", value, { shouldValidate: true })}
              payment={payment}
              promotions={promotions}
              payments={payments}
              errors={errors}
              isEdit={!isCompleted || !is_ecommerce_source}
              loading={formLoading || !open}
            />
            {row?.id && !isEdit && <OrderHistoryTimeline order={getValues() as OrderType} />}
          </Grid>
          <Grid item xs={12} lg={3}>
            <Stack spacing={2}>
              <General
                isAvailableInventory={!isDenyConfirm}
                confirmDisabled={isCompleted}
                onChange={(key, value) =>
                  setValue<keyof OrderFormType>(key, value, { shouldValidate: true })
                }
                errors={errors}
                disabled={isShipping || is_ecommerce_source}
                loading={formLoading || !open}
                defaultTagOptions={orderContext?.tags}
                defaultStatus={orderDefault?.status}
                orderID={row?.id}
                {...watch()}
              />
              <Customer
                onChangeShippingAddress={(value) =>
                  setValue<keyof OrderFormType>("shipping_address", value, { shouldValidate: true })
                }
                onChange={(key, value) =>
                  setValue<keyof OrderFormType>(key, value, { shouldValidate: true })
                }
                errors={errors}
                disabledSearch={!!row?.id && !isDuplidateOrderState}
                disabledChange={!!shipping || !customer?.id || is_ecommerce_source}
                loading={formLoading || !open}
                defaultStatus={orderDefault?.status}
                orderID={row?.id}
                creatorID={created_by?.id}
                {...watch()}
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <BottomPanel
        onSubmit={handleConfirmForm}
        submitDisabled={disabledSubmit}
        id={row?.id}
        loading={orderDetail.loading}
        orderKey={order_key}
        onClose={isPage ? undefined : handleCloseModal}
      />
    </>
  );
};

export default memo(OrderDetail);
