// Libraries
import { useTheme } from "@mui/material/styles";
import find from "lodash/find";
import map from "lodash/map";
import reduce from "lodash/reduce";
import some from "lodash/some";
import { useContext, useEffect, useMemo, useState } from "react";

// Services
import { deliveryApi } from "_apis_/delivery.api";

// Hooks
import usePopup from "hooks/usePopup";

// Context
import { useAppSelector } from "hooks/reduxHook";
import { useCancelToken } from "hooks/useCancelToken";
import { leadStore } from "store/redux/leads/slice";
import { ShippingContext } from "views/ShippingView/context";

// Components
import DataGrid from "components/DataGrid";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import UpdateShipping from "views/ShippingView/components/UpdateShipping";

// Types
import { SHIPPING_COMPANIES } from "_types_/GHNType";
import { GridSizeType } from "_types_/GridLayoutType";
import { ShippingType } from "_types_/ShippingType";
import { SortType } from "_types_/SortType";

// Constants
import { statusNotification } from "constants/index";
import { ROLE_TAB, STATUS_ROLE_SHIPPING } from "constants/rolesTab";
import { chooseParams, handleParamsHeaderFilter } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import {
  SHIPPING_STATUS,
  TYPE_SHIPPING_COMPANIES,
  domainGhn,
  domainVnPost,
  filterData,
  keyFilter,
  optionStatusShipping,
  paramsDefault,
  paramsGetDefault,
  paymentTypeValue,
  renderTableDetail,
} from "views/ShippingView/constants";

// --------------------------------------------------------------------

const TabContainer = ({ status }: { status: STATUS_ROLE_SHIPPING }) => {
  // Other
  const theme = useTheme();
  const { newCancelToken } = useCancelToken();
  const leadSlice = useAppSelector(leadStore);
  const { setDataPopup, setNotifications, isSubmit } = usePopup<{
    id: string;
    carrier_status_manual: string;
    is_cod_transferred: string;
  }>();
  const {
    state: store,
    updateColumn,
    updateCell,
    resizeColumn,
    orderColumn,
    updateParams,
  } = useContext(ShippingContext);

  // State
  const [data, setData] = useState<ShippingType[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 200, ordering: "-created" });
  const [dataTotal, setDataTotal] = useState<number>(0);
  const [isShowFullTable, setShowFullTable] = useState(false);

  const { params: paramsStore, [status]: columns } = store;

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore, newCancelToken, status]);

  useEffect(() => {
    if (isSubmit) {
      loadDataTable();
    }
  }, [isSubmit]);

  const loadDataTable = () => {
    const objParams = {
      ...params,
      ...paramsStore,
      created__date__gte: paramsStore.created_from,
      created__date__lte: paramsStore.created_to,
      search: paramsStore.search_all_shipping,
      carrier_status:
        status === STATUS_ROLE_SHIPPING.ALL
          ? paramsStore.carrier_status || ""
          : SHIPPING_STATUS[status as keyof typeof SHIPPING_STATUS],
    };

    const newParams = chooseParams(objParams, ["search", ...paramsGetDefault]);

    getListShipping(newParams);
  };

  const getListShipping = async (params: any) => {
    if (params) {
      setLoading(true);
      const result = await deliveryApi.get(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        `shipment/`
      );

      if (result && result.data) {
        const { results = [], count = 0 } = result.data;
        const newData = (results || []).map((item: ShippingType) => {
          const deliveryCompany = find(
            TYPE_SHIPPING_COMPANIES,
            (current) => current.value === item.delivery_company_type
          );

          const objStatusShipping = find(
            optionStatusShipping,
            (current) => current.value === item.carrier_status
          );

          const paymentType =
            find(paymentTypeValue, (option) => option.value === item.payment_type_id)?.label || "";

          return {
            ...item,
            created_by_name: getObjectPropSafely(() => item.created_by.name),
            client_order_code: {
              value: item.client_order_code,
              props: {
                href: `/${ROLE_TAB.ORDERS}/${item?.order}`,
                variant: "body2",
                color: theme.palette.info.main,
              },
            },
            tracking_number: {
              value: item.tracking_number,
              props: {
                href:
                  getObjectPropSafely(() => item.delivery_company_type) === SHIPPING_COMPANIES.GHN
                    ? domainGhn + item.tracking_number
                    : getObjectPropSafely(() => item.delivery_company_type) ===
                      SHIPPING_COMPANIES.VNPOST
                    ? domainVnPost + item.tracking_number
                    : "",
                variant: "body2",
              },
            },
            delivery_company_type_show: {
              value: deliveryCompany?.label,
              color: deliveryCompany?.color,
            },
            carrier_status_show: {
              value: objStatusShipping?.label,
              color: objStatusShipping?.color,
            },
            product: map(item.items, (current) => ({
              thumb_img_product: current.url,
              product_name: {
                value: current.name,
                props: {
                  href: `/${ROLE_TAB.PRODUCT}/${getObjectPropSafely(() => current.code)}`,
                },
              },
              product_price: current.price,
              product_quantity: current.quantity,
            })),
            payment_type_show: {
              value: paymentType ? `${paymentType} trả phí` : "",
              color: "default",
            },
            cod_transferred_show: {
              value: item.is_cod_transferred ? "Đã chuyển COD" : "Chờ chuyển COD",
              color: item.is_cod_transferred ? "success" : "error",
            },
            product_name: getObjectPropSafely(() => item.items[0]?.name),
            product_price: getObjectPropSafely(() => item.items[0]?.price),
            product_quantity: getObjectPropSafely(() => item.items[0]?.quantity),
            operation: {
              isShowEdit: true,
            },
          };
        });

        setData(newData);
        setDataTotal(count);
      }
      setLoading(false);
    }
  };

  const handleChangeSorting = (value: SortType[]) => {
    const ordering = value[0].direction === "asc" ? value[0].columnName : "-" + value[0].columnName;

    setParams({
      ...params,
      ordering,
    });
  };

  const handleFilter = (paramsProps: any) => {
    setParams({
      ...params,
      page: 1,
    });

    updateParams(paramsProps);
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const headerFilterChannel = useMemo(() => {
    return getObjectPropSafely(() => leadSlice.attributes.channel.length)
      ? map(leadSlice.attributes.channel, (item) => ({
          label: item.name,
          value: item.id,
        }))
      : [];
  }, []);

  const handleShowPopup = (optional: any) => {
    let typeProduct = "";
    let funcContentSchema: any;
    let buttonTextPopup = "Cập nhật";
    let funcContentRender: any = (methods: any) => <UpdateShipping {...methods} />;
    let defaultData = {};
    let title = "Cập nhật vận đơn";
    let isShowFooter = true;
    let maxWidthForm: GridSizeType = "sm";
    let zIndex = 1300;

    defaultData = {
      id: optional.id,
      carrier_status_manual: getObjectPropSafely(() => optional.carrier_status),
      is_cod_transferred: optional.is_cod_transferred,
      objFinishDate: {
        isShowFinishDate: false,
        finishDate: new Date(),
      },
    };
    funcContentSchema = (yup: any) => {
      return {
        carrier_status_manual: yup.string(),
        is_cod_transferred: yup.bool(),
        objFinishDate: yup.mixed(),
      };
    };

    setDataPopup({
      zIndex,
      maxWidthForm,
      buttonText: buttonTextPopup,
      isOpenPopup: true,
      title,
      isDisabledSubmit: true,
      defaultData,
      type: typeProduct,
      funcContentRender,
      funcContentSchema,
      isShowFooter,
    });
  };

  const handleCancelOrderShipping = async () => {
    if (!getObjectPropSafely(() => columns.columnSelected.length)) {
      setNotifications({
        message: "Vui lòng chọn một đơn hàng",
        variant: statusNotification.WARNING,
      });

      return;
    }

    if (getObjectPropSafely(() => columns.columnSelected.length) > 1) {
      setNotifications({
        message: "Chỉ hủy được một đơn hàng cùng lúc",
        variant: statusNotification.WARNING,
      });

      return;
    }

    const isDeliveryOther = some(
      data,
      (item) => !item.delivery_company && columns.columnSelected.includes(item.id)
    );

    if (isDeliveryOther) {
      setNotifications({
        message: "Không hủy được đơn hàng vận chuyển khác, vui lòng hủy thủ công",
        variant: statusNotification.WARNING,
      });

      return;
    }

    const arrDataSelected = reduce(
      data,
      (prevArr, current: ShippingType) => {
        return columns.columnSelected.includes(current.id)
          ? [...prevArr, current.delivery_company]
          : prevArr;
      },
      []
    );

    const paramsCancel = {
      delivery_company: arrDataSelected[0],
      shipment: columns.columnSelected,
    };

    const result = await deliveryApi.create(paramsCancel, "cancel-shipping-order/");

    if (result && result.data) {
      setNotifications({
        message: "Hủy vận đơn thành công",
        variant: statusNotification.SUCCESS,
      });

      await loadDataTable();

      updateColumn(status, {
        columnSelected: [],
      });
    }
  };

  const renderHeader = () => {
    const dataRenderHeader = [
      ...(status === STATUS_ROLE_SHIPPING.ALL
        ? [
            {
              style: {
                width: 200,
              },
              status: keyFilter.SHIPPING_STATUS,
              title: "Trạng thái giao hàng",
              options: optionStatusShipping,
              label: "carrier_status",
              defaultValue: "all",
            },
          ]
        : []),
      ...filterData({ optionChannel: headerFilterChannel }),
    ];

    const contentArrButtonOptional: any = [
      {
        content: <>Hủy vận đơn</>,
        color: "error",
        handleClick: handleCancelOrderShipping,
      },
    ];

    return (
      <HeaderFilter
        isFullTable={isShowFullTable}
        searchInput={[
          {
            keySearch: "search_all_shipping",
            label: "Nhập tên KH, SĐT, mã ĐH, mã VC",
          },
        ]}
        dataExport={data}
        dataRenderHeader={dataRenderHeader}
        params={newParamsStore}
        paramsDefault={paramsDefault}
        arrNoneRenderSliderFilter={["created_dateValue"]}
        arrAttachUnitVnd={["cod_amount", "product_price", "insurance_value", "cod_amount"]}
        arrDateTime={["created", "expected_delivery_time"]}
        arrDate={["finish_date"]}
        // contentArrButtonOptional={
        //   status === STATUS_ROLE_SHIPPING.PICKING ? contentArrButtonOptional : []
        // }
        columns={{
          ...columns,
          columnShowExport: columns.columnsShow,
        }}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        onChangeColumn={(columns) => updateCell(status, columns)}
        onToggleModeTable={() => setShowFullTable(!isShowFullTable)}
      />
    );
  };

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(paramsStore, [
      "search_all_shipping",
      "is_cod_transferred",
      "order_source",
      "delivery_company_type",
      "carrier_status",
      "created_from",
      "created_to",
      "created_dateValue",
    ]);
  }, [paramsStore]);

  const newResultColumnsShow = useMemo(() => {
    return getObjectPropSafely(() => columns.resultColumnsShow.length)
      ? map(columns.resultColumnsShow, (item) => {
          return status === STATUS_ROLE_SHIPPING.PICKING && item.name === "isCheck"
            ? {
                ...item,
                isShow: true,
              }
            : ![
                STATUS_ROLE_SHIPPING.ALL,
                STATUS_ROLE_SHIPPING.PICKING,
                STATUS_ROLE_SHIPPING.RETURNED,
              ].includes(status) && item.name === "operation"
            ? {
                ...item,
                isShow: true,
              }
            : item;
        })
      : [];
  }, [columns.resultColumnsShow, status]);

  const newData = useMemo(() => {
    return status === STATUS_ROLE_SHIPPING.PICKING
      ? data.map((item: any) => {
          return {
            ...item,
            isCheck: columns.columnSelected.includes(item.id),
          };
        })
      : data;
  }, [columns.columnSelected, data]);

  return (
    <DataGrid
      isFullTable={isShowFullTable}
      data={newData}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={newResultColumnsShow}
      columnWidths={columns.columnsWidthResize}
      isLoadingTable={isLoading}
      listTabDetail={["shipping_history", "order_history", "transpotation_history"]}
      contentColumnHandleOperation={{
        arrColumnHandleOperation: ["operation"],
        handleEdit: handleShowPopup,
      }}
      contentColumnShowInfo={{
        arrColumnShowInfo: [
          "time",
          "delivery",
          "carrier_status",
          "product",
          "customer",
          "sender",
          "payment",
          "note",
        ],
        infoCell: columns.columnsShow,
      }}
      arrHandleList={["product"]}
      arrColumnThumbImg={["product"]}
      arrAttachUnitVnd={["cod_amount", "product_price", "insurance_value", "cod_amount"]}
      arrDateTime={["created", "expected_delivery_time"]}
      arrDate={["finish_date"]}
      arrColumnHandleLink={["client_order_code", "tracking_number", "product_name"]}
      arrColumnEditLabel={[
        "delivery_company_type_show",
        "carrier_status_show",
        "payment_type_show",
        "cod_transferred_show",
      ]}
      arrValueTitle={["to_name", "return_name"]}
      arrColumnPhone={["to_phone", "return_phone"]}
      renderHeader={renderHeader}
      renderTableDetail={(row: any, value: number) =>
        renderTableDetail(row, value, { paramsStore, isShowFullTable })
      }
      setColumnWidths={(columns) => resizeColumn(status, columns)}
      handleChangeColumnOrder={(columns) => orderColumn(status, columns)}
      handleChangeRowsPerPage={(rowPage: number) =>
        setParams({
          ...params,
          limit: rowPage,
          page: 1,
        })
      }
      handleChangePage={(page: number) => setParams({ ...params, page })}
      handleSorting={handleChangeSorting}
      handleCheckColumn={(columnSelected: string[]) =>
        updateColumn(status, {
          columnSelected,
        })
      }
    />
  );
};

export default TabContainer;
