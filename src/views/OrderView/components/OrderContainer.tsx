import { orderApi } from "_apis_/order.api";
import { OrderType } from "_types_/OrderType";
import vi from "locales/vi.json";
import WrapPage from "layouts/WrapPage";
import { ROLE_TAB, STATUS_ROLE_ORDERS } from "constants/rolesTab";
import { useAppDispatch } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import { useCancelToken } from "hooks/useCancelToken";
import useIsMountedRef from "hooks/useIsMountedRef";
import { memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toastError } from "store/redux/toast/slice";
import { fDateTime } from "utils/dateUtil";
import { isMatchRoles } from "utils/roleUtils";
import { OrderContext } from "views/OrderView";
import { ORDER_SORTING_STATE_EXTENSIONS, ORDER_SORT_FIELDS } from "../constants/columns";
import FormOrderModal from "./FormOrderModal";
import Header, { HeaderOrderProps } from "./Header";
import OrderPrintModal from "./OrderPrintModal";
import OrderRowDetail from "./OrderRowDetail";
import OrderTable, { OrderTableType } from "./OrderTable";
import useUploadPopup from "hooks/useUploadPopup";
import { DGridDataType } from "_types_/DGridType";
import { formatExportOrder } from "features/order/exportExcel";

export const defaultOrderForm: Partial<OrderType> = {
  payment: { total_actual: 0, payment_status: "PENDING" },
  customer: {},
  name: "",
  line_items: [],
  note: "",
  total_actual: 0,
  is_available_shipping: false,
  status: "draft",
};

interface Props extends Partial<OrderTableType>, Partial<HeaderOrderProps> {
  isSearch?: boolean;
  isCreate?: boolean;
  hiddenHeader?: boolean;
  isShowDetail?: boolean;
  directionAfterAlternatived?: boolean;
}

type Provided =
  | "selection"
  | "setSelection"
  | "data"
  | "setOpen"
  | "onRefresh"
  | "exportData"
  | "exportFileName"
  | "loading"
  | "onSearch"
  | "handlePrintOrder"
  | "editComponent"
  | "showSelectAll"
  | "detailComponent"
  | "sortingStateColumnExtensions";

const OrderContainer = (props: Omit<Props, Provided>) => {
  const {
    isCreate = true,
    isShowDetail = true,
    directionAfterAlternatived,
    hiddenHeader,
    isSearch,
    params,
    setParams,
    tabName,
    tagOptions,
  } = props;
  const { onOpenPopup, onClosePopup } = useUploadPopup({
    title: "Tải lên file đối soát",
    isShowFooter: false,
    apiUpload: (file) => orderApi.upload(file, "upload/file/payments/"),
    onUploadSuccess: () => onClosePopup(),
  });
  const { user } = useAuth();
  const [data, setData] = useState<DGridDataType<OrderType>>({
    data: [],
    loading: false,
    count: 0,
  });
  const [dataAll, setDataAll] = useState<{ orders: OrderType[]; total: number }>({
    orders: [],
    total: 0,
  });
  const isMounted = useIsMountedRef();
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [openPrintModal, setOpenPrintModal] = useState(false);
  const [selection, setSelection] = useState<number[]>([]);
  const dispatch = useAppDispatch();
  const { newCancelToken } = useCancelToken([params]);

  const isHandleOrder = isMatchRoles(
    user?.is_superuser,
    user?.group_permission?.data?.[ROLE_TAB.ORDERS]?.[STATUS_ROLE_ORDERS.HANDLE]
  );
  const orderContext = useContext(OrderContext);

  const getData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));

    const ordering =
      params?.ordering === "order"
        ? "order_key"
        : params?.ordering === "-order"
        ? "-order_key"
        : params?.ordering;

    const result = await orderApi.get<OrderType>({
      params: { ...params, ordering, cancelToken: newCancelToken() },
      endpoint: "get/all/",
    });
    if (result?.data) {
      const { results = [], count = 0 } = result.data;
      setData((prev) => ({ ...prev, data: results, count, loading: false }));
      return;
    }
    if (result?.error?.name === "CANCEL_REQUEST") {
      return;
    }

    setSelection([]);
    setData((prev) => ({ ...prev, loading: false }));
    // handleDeleteStorageOrderParams();
  }, [params, newCancelToken]);

  const getDataAll = async () => {
    // let startTime = performance.now()
    setData((prev) => ({ ...prev, loading: true }));
    const ids = data.data.filter((item, index) => selection.includes(index));
    const temp: any = await Promise.all(
      ids.map(async (item) => {
        const result = await orderApi.getId<OrderType>({
          params: { cancelToken: newCancelToken() },
          endpoint: `${item.id}/`,
        });

        return result?.data?.data;
      })
    );

    if (temp?.error?.name === "CANCEL_REQUEST") {
      return;
    }

    setDataAll((prev) => ({ ...prev, orders: temp }));

    setData((prev) => ({ ...prev, loading: false }));
  };

  const handleSetParams = (name: string, value: string) => {
    setParams?.({ ...params, [name]: value, page: 1 });
  };

  const handleAlternativeOrderSuccess = async () => {
    getData();
  };

  const handleCloseOrderDrawer = () => {
    setOpenModal(null);
  };

  const handlePrintSuccess = () => {
    setSelection([]);
    getData();
  };

  const handlePrintOrder = () => {
    if (selection.length > 0) {
      getDataAll();
      setOpenPrintModal(!openPrintModal);
    } else {
      dispatch(toastError({ message: "Vui lòng chọn đơn hàng để in" }));
    }
  };

  useEffect(() => {
    isMounted && orderContext?.setPageParams(params);
  }, [params, isMounted, orderContext]);

  useEffect(() => {
    getData();
  }, [getData]);

  const editComponent = isHandleOrder
    ? (contentProps: {
        row: any;
        onChange: ({ name, value }: { name: string; value: any }) => void;
        onApplyChanges: () => void;
        onCancelChanges: () => void;
        open: boolean;
        editingRowIds?: number[] | undefined;
      }) => (
        <FormOrderModal
          {...contentProps}
          onClose={contentProps.onCancelChanges}
          submitText={vi.button.update}
          onApplyChanges={() => {
            handleAlternativeOrderSuccess();
            contentProps.onApplyChanges();
          }}
          directionAfterAlternatived={directionAfterAlternatived}
        />
      )
    : undefined;

  const detailComponent = isShowDetail
    ? ({ row }: any) => (
        <OrderRowDetail
          row={row}
          defaultTab={tabName === "shipping" ? "SHIPPING_HISTORY" : "ORDER_HISTORY"}
        />
      )
    : undefined;

  return (
    <WrapPage>
      <FormOrderModal
        open={openModal === "create"}
        onClose={handleCloseOrderDrawer}
        onApplyChanges={handleAlternativeOrderSuccess}
        submitText={vi.button.create}
        defaultValue={defaultOrderForm}
      />
      <OrderPrintModal
        open={openPrintModal}
        setOpen={setOpenPrintModal}
        selection={selection}
        data={dataAll.orders}
        loading={data.loading}
        handlePrintSuccess={handlePrintSuccess}
        exportFlag
      />
      {!hiddenHeader && (
        <Header
          tagOptions={tagOptions || orderContext?.tags}
          setOpen={isCreate ? () => setOpenModal("create") : undefined}
          setParams={(newParams) => props?.setParams?.({ ...params, ...newParams })}
          onRefresh={() => props?.setParams?.({ ...params })}
          exportData={data.data}
          formatExportFunc={formatExportOrder}
          exportFileName={`Danh-sach-don-hang-${fDateTime(Date.now())}`}
          loading={data.loading}
          onSearch={isSearch ? (value) => handleSetParams("search", value) : undefined}
          handlePrintOrder={handlePrintOrder}
          onToggleUploadPaymentCheckFile={onOpenPopup}
          sortFields={ORDER_SORT_FIELDS}
          {...props}
        />
      )}
      <OrderTable
        data={{ data: data.data, loading: data.loading, count: data.count }}
        editComponent={editComponent}
        showSelectAll
        detailComponent={detailComponent}
        selection={selection}
        setSelection={selection ? setSelection : undefined}
        onRefresh={() => props?.setParams?.({ ...params })}
        sortingStateColumnExtensions={ORDER_SORTING_STATE_EXTENSIONS}
        {...props}
      />
    </WrapPage>
  );
};

/**
 *
 * @default isCreate true
 * @default isShowDetail true
 * @returns
 */
export default memo(OrderContainer);
