//hooks
import { useAppDispatch } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

//components
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { SlideTransition } from "components/Transisitions";
import PrintOrder, { ProductProps } from "views/OrderView/components/OrderPrintModal/PrintOrder";
import ConfirmPrintPopup from "./ConfirmPrintPopup";

//types
import { OrderType } from "_types_/OrderType";

//utils
import vi from "locales/vi.json";
import { RESPONSE_MESSAGES } from "assets/messages/response.messages";
import { forEach } from "lodash";
import map from "lodash/map";
import reduce from "lodash/reduce";
import { toastError, toastSuccess } from "store/redux/toast/slice";
import { fDateTime } from "utils/dateUtil";
import { writeFile } from "utils/xlsxFileUtil";

//apis
import { orderApi } from "_apis_/order.api";
import { formatExportOrder } from "features/order/exportExcel";
import { formatLineItemsForPrint } from "features/order/formatData";

export default function OrderPrintModal({
  open,
  setOpen,
  selection,
  data,
  loading,
  handlePrintSuccess,
  exportFlag = false,
}: {
  open: boolean;
  loading: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selection: number[];
  data: OrderType[];
  handlePrintSuccess?: () => void;
  exportFlag?: boolean;
}) {
  const dispatch = useAppDispatch();
  const componentRef = useRef();
  const theme = useTheme();
  const { user } = useAuth();

  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [fetching, setIsFetching] = useState(false);
  const [isExportAfterPrint, setIsExportAfterPrint] = useState(true);

  const handlePrint = useReactToPrint({
    content: () => componentRef?.current || null,
    documentTitle: `Don-hang-${Date.now()}`,
    copyStyles: true,
    onPrintError: () => {
      dispatch(toastError({ message: "Có lỗi xảy ra. Vui lòng thử lại" }));
    },
    onAfterPrint: () => {
      setIsOpenConfirm(true);
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseConfirm = () => {
    setIsOpenConfirm(false);
  };

  const handleCancel = () => {
    setIsOpenConfirm(false);
  };

  const handleConfirm = () => {
    handleUpdateAfterPrint();
  };

  const dataExport = useMemo(() => {
    const newData = reduce(
      data,
      (prev: any[], current: any) => {
        const productList: ProductProps[] = formatLineItemsForPrint(current?.line_items);
        forEach(productList, (item) => {
          prev = [
            ...prev,
            {
              ...current,
              variant_name: item?.name,
              variant_SKU: item?.SKUCode,
              variant_price: item?.price,
              variant_quantity: item?.quantity,
              variant_total: item?.salePrice,
            },
          ];
        });
        return prev;
      },
      []
    );
    return newData;
  }, [data]);

  const handleExport = () => {
    writeFile({
      defaultData: dataExport.map((item) => ({
        ...item,
        ...(!item.is_printed && {
          is_printed: true,
          printed_at: Date.now(),
          printed_by: { name: user?.name },
        }),
      })),
      formatExportFunc: formatExportOrder,
      fileName: `Danh-sach-don-hang-da-in-${fDateTime(Date.now())}`,
    });
  };

  const handleUpdateAfterPrint = async () => {
    setIsFetching(true);
    const orderIdList = data.map((item) => item.id);
    const result = await orderApi.create<OrderType>({
      endpoint: `print/multi/`,
      params: { order_id_list: orderIdList },
    });

    if (result?.data) {
      dispatch(
        toastSuccess({
          message: RESPONSE_MESSAGES.PRINT_SUCCESS,
        })
      );
      if (isExportAfterPrint && exportFlag) {
        handleExport();
      }
      handleCloseConfirm();
      handleClose();
      handlePrintSuccess && handlePrintSuccess();
    } else {
      dispatch(
        toastError({
          message: RESPONSE_MESSAGES.PRINT_FAILED,
        })
      );
    }
    setIsFetching(false);
  };

  // const dataFilter = useMemo(() => {
  //   return data.filter((_, index: number) => selection.includes(index));
  // }, [data, selection]);

  const dataPrint: any = useMemo(() => {
    return map(data, (order: any) => {
      const productList: any = formatLineItemsForPrint(order?.line_items);
      const calcTotalAfterDiscount =
        reduce(
          productList,
          (prev: number, current: any) => {
            prev += current.salePrice * (current.quantity - current.giftVariantQuantity);
            return prev;
          },
          0
        ) || 0;

      return {
        orderNumber: order?.order_key,
        shippingNumber: order?.shipping?.tracking_number,
        orderDate: order?.created,
        customerName: order?.customer_name,
        customerPhone: order?.customer_phone,
        address:
          order?.shipping_address?.address ||
          (order?.customer?.shipping_addresses?.length > 0
            ? order?.customer?.shipping_addresses[0].address
            : ""),
        discount: order?.discount_input || 0,
        shippingCost: order?.fee_delivery,
        totalActual: order?.total_actual,
        total: order?.cost,
        orderTotal: order?.total_variant_all,
        orderTotalAfterDiscount: calcTotalAfterDiscount,
        products: productList,
        note: order?.note,
        deliveryNote: order?.delivery_note,
        promotion: order?.discount_promotion,
        paid: order?.paid,
        additionalFee: order?.fee_additional,
      };
    });
  }, [data]);

  return (
    <>
      <ConfirmPrintPopup
        open={isOpenConfirm}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        loading={fetching}
        isExportAfterPrint={isExportAfterPrint}
        setIsExportAfterPrint={exportFlag ? setIsExportAfterPrint : null}
      />
      <Dialog
        open={open}
        TransitionComponent={SlideTransition}
        keepMounted
        onClose={handleClose}
        fullScreen
      >
        <DialogTitle sx={{ p: "16px 24px" }}>{vi.print_order}</DialogTitle>
        <Divider />
        <DialogContent>
          {loading ? (
            <Box sx={styles.containerLoading}>
              <Typography sx={{ ...styles.loading, color: theme.palette.primary.main }}>
                ĐANG TẢI ĐƠN ĐỂ IN...
              </Typography>
              <LinearProgress sx={{ width: "100%", my: 2, maxWidth: "1000px" }} />
              <Typography sx={{ ...styles.loading, color: theme.palette.primary.main }}>
                Vui lòng đợi
              </Typography>
            </Box>
          ) : (
            <PrintOrder orders={dataPrint} ref={componentRef} />
          )}
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleClose}> {vi.button.close}</Button>
          <Button variant="contained" onClick={handlePrint} disabled={loading}>
            {vi.button.print_order}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const styles: any = {
  containerLoading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height: "100%",
  },
  loading: {
    fontSize: "0.8125rem",
    fontWeight: 600,
  },
};
