// Libraries
import { useContext, useMemo, useReducer, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

// Services
import { productApi } from "_apis_/product";

// Context
import { StoreWarehouse } from "views/WarehouseView/contextStore";
import usePopup from "hooks/usePopup";
import { useCancelToken } from "hooks/useCancelToken";
import { getAllAttributesWarehouse } from "selectors/attributes";
import { useAppSelector } from "hooks/reduxHook";

// Components
import DDataGrid from "components/DDataGrid";
import AddIcon from "@mui/icons-material/Add";
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";
import { Span } from "components/Labels";

// @Types
import { InitialState } from "_types_/FacebookType";
import { ColorSchema } from "_types_/ThemeColorType";

// Constants & Utils
import {
  actionType,
  keyFilter,
  dataFilterConfirm,
  message,
  handleDataApi,
  contentGetValueExport,
  handleDataExport,
  dataFilterSoftDeleted,
  paramsDefault,
} from "views/WarehouseView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { handleParamsApi } from "utils/formatParamsUtil";
import { handleParamsHeaderFilter } from "utils/formatParamsUtil";
import { statusNotification, TYPE_FORM_FIELD } from "constants/index";
import { STATUS_ROLE_WAREHOUSE } from "constants/rolesTab";
import { TypeWarehouseSheet } from "_types_/WarehouseType";

// -------------------------------------------------------------------

const initState: InitialState = {
  data: [],
  loading: false,
  params: {
    page: 1,
    limit: 200,
    ordering: "-created",
  },
  dataTotal: 0,
  isShowFullTable: false,
};

const storeStocktaking = (state: InitialState, action: any) => {
  if (action && action.type) {
    const { payload = {} } = action;
    switch (action.type) {
      case actionType.UPDATE_DATA: {
        return {
          ...state,
          ...payload,
        };
      }
      case actionType.UPDATE_DATA_TOTAL: {
        return {
          ...state,
          ...payload,
        };
      }
      case actionType.UPDATE_LOADING: {
        return {
          ...state,
          ...payload,
        };
      }
      case actionType.UPDATE_PARAMS: {
        return {
          ...state,
          params: {
            ...state.params,
            ...payload,
          },
        };
      }
      case actionType.UPDATE_SHOW_FULL_TABLE: {
        return {
          ...state,
          ...payload,
        };
      }
    }
  }
};

const Stocktakings = () => {
  const theme = useTheme();
  const { newCancelToken } = useCancelToken();
  const attributesWarehouse = useAppSelector((state) =>
    getAllAttributesWarehouse(state.attributes)
  );
  const [state, dispatch] = useReducer(storeStocktaking, initState);
  const { state: store, dispatch: dispatchStore } = useContext(StoreWarehouse);
  const { setNotifications } = usePopup();

  const { stocktaking, params: paramsStore } = store;
  const { data, params, dataTotal, loading, isShowFullTable } = state;

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore]);

  useEffect(() => {
    const newData = data.map((item: any) => {
      return {
        ...item,
        isCheck: stocktaking.columnSelected.includes(item.id),
      };
    });

    dispatch({
      type: actionType.UPDATE_DATA,
      payload: {
        data: newData,
      },
    });
  }, [stocktaking.columnSelected]);

  const loadDataTable = () => {
    const objParams = handleParamsApi(
      {
        ...params,
        ...paramsStore,
        type: TypeWarehouseSheet.STOCKTAKING,
        search: paramsStore.search_stocktakings,
        is_confirm: paramsStore.is_confirm_stocktakings,
        reason: paramsStore.reason_stocktakings,
        is_deleted: false,
      },
      [
        "search",
        "type",
        "is_confirm",
        "reason",
        "created_from",
        "is_deleted",
        "created_to",
        "is_deleted",
        "confirmed_date_from",
        "confirmed_date_to",
      ]
    );
    getListStocktaking(objParams);
  };

  const getListStocktaking = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: true,
        },
      });
      const result = await productApi.get(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        "warehouse-sheet/"
      );

      if (result && result.data) {
        const { results = [], count } = result.data;
        const newData = results.map((item: any) => {
          return {
            ...item,
            warehouse: {
              value: item.inventoried_warehouse,
              content: item.inventoried_warehouse ? (
                <Span variant={theme.palette.mode === "light" ? "ghost" : "filled"} color="info">
                  {item.inventoried_warehouse}
                </Span>
              ) : (
                <></>
              ),
            },
            ...handleDataApi(item, stocktaking.columnSelected, {
              color: theme.palette.primary.main,
            }),
          };
        });

        dispatch({
          type: actionType.UPDATE_DATA,
          payload: {
            data: newData,
          },
        });

        dispatch({
          type: actionType.UPDATE_DATA_TOTAL,
          payload: {
            dataTotal: count,
          },
        });
      }

      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: false,
        },
      });
    }
  };

  const handleResizeColumns = (value: any) => {
    dispatchStore({
      type: actionType.RESIZE_COLUMN_STOCKTAKING,
      payload: {
        columnsWidthResize: value,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_STOCKTAKING,
      payload: {
        columnsOrder: columns,
      },
    });
  };

  const handleChangeColumn = (column: any) => {
    dispatchStore({
      type: actionType.UPDATE_STOCKTAKING,
      payload: column,
    });
  };

  const handleFilter = (params: any) => {
    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        page: 1,
      },
    });

    dispatchStore({
      type: actionType.UPDATE_PARAMS,
      payload: {
        ...params,
      },
    });
  };

  const handleChangePage = (page: number) => {
    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        page,
      },
    });
  };

  const handleChangeRowsPerPage = (rowPage: number) => {
    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        limit: rowPage,
        page: 1,
      },
    });
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const handleShowFullTable = () => {
    dispatch({
      type: actionType.UPDATE_SHOW_FULL_TABLE,
      payload: {
        isShowFullTable: !isShowFullTable,
      },
    });
  };

  const handleConfirmSheet = async () => {
    if (!stocktaking.columnSelected.length) {
      setNotifications({
        message: "Vui lòng chọn phiếu để xác nhận",
        variant: statusNotification.WARNING,
      });

      return;
    }

    const params = {
      id_list: stocktaking.columnSelected,
    };

    const result = await productApi.create(params, "warehouse-sheet/confirm/multi/");

    if (result && result.data) {
      setNotifications({
        message: message.CONFIRM_SUCCESS,
        variant: statusNotification.SUCCESS,
      });

      loadDataTable();
    }
  };

  const handleCheckColumn = (isCheck: boolean, row: any) => {
    let columnSelected = [...stocktaking.columnSelected];
    if (isCheck) {
      columnSelected.push(row.id);
    } else {
      columnSelected = columnSelected.filter((item) => item !== row.id);
    }

    dispatchStore({
      type: actionType.UPDATE_COLUMN_SELECTED_STOCKTAKINGS,
      payload: {
        columnSelected,
      },
    });
  };

  const handleCheckedAll = (isCheck: boolean) => {
    let columnSelected = [];
    if (isCheck) {
      columnSelected = data.map((item: any) => item.id);
    }

    dispatchStore({
      type: actionType.UPDATE_COLUMN_SELECTED_STOCKTAKINGS,
      payload: {
        columnSelected,
      },
    });
  };

  const columnShowExport = useMemo(() => {
    return handleDataExport(stocktaking.resultColumnsShow);
  }, [stocktaking.resultColumnsShow]);

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(paramsStore, [
      "search_stocktakings",
      "is_confirm_stocktakings",
      "reason_stocktakings",
      "is_deleted",
      "created_from",
      "created_to",
      "created_dateValue",
      "confirmed_date_from",
      "confirmed_date_to",
      "confirmed_date_dateValue",
    ]);
  }, [paramsStore]);

  const renderHeader = () => {
    const dataRenderHeader = [
      {
        style: {
          width: 200,
        },
        status: keyFilter.IS_CONFIRM,
        title: "Trạng thái",
        options: dataFilterConfirm,
        label: "is_confirm_stocktakings",
        defaultValue: getObjectPropSafely(() => dataFilterConfirm[0].value) || "",
      },
      {
        style: {
          width: 200,
        },
        status: keyFilter.IS_DELETED,
        title: "Trạng thái hủy",
        options: dataFilterSoftDeleted,
        label: "is_deleted",
        defaultValue: getObjectPropSafely(() => dataFilterSoftDeleted[2].value),
      },
      {
        style: {
          width: 200,
        },
        status: keyFilter.REASON,
        title: "Lý do kiểm hàng",
        options: attributesWarehouse.stocktakingReason,
        label: "reason_stocktakings",
        defaultValue:
          getObjectPropSafely(() => attributesWarehouse.stocktakingReason[0].value) || "",
      },
      {
        type: TYPE_FORM_FIELD.DATE,
        title: "Thời gian tạo",
        keyDateFrom: "created_from",
        keyDateTo: "created_to",
        keyDateValue: "created_dateValue",
      },
      {
        type: TYPE_FORM_FIELD.DATE,
        title: "Thời gian xác nhận",
        keyDateFrom: "confirmed_date_from",
        keyDateTo: "confirmed_date_to",
        keyDateValue: "confirmed_date_dateValue",
      },
    ];

    const contentArrButtonOptional: {
      content: JSX.Element;
      color?: ColorSchema;
      handleClick: () => void;
    }[] = [
      {
        content: <>Xác nhận phiếu</>,
        handleClick: handleConfirmSheet,
      },
      {
        content: (
          <>
            <AddIcon /> Kiểm hàng
          </>
        ),
        handleClick: () =>
          window.open(`/${STATUS_ROLE_WAREHOUSE.SHEET}/new/${STATUS_ROLE_WAREHOUSE.STOCKTAKING}`),
      },
    ];

    return (
      <HeaderFilter
        isFullTable={isShowFullTable}
        searchInput={[
          {
            keySearch: "search_stocktakings",
            label: "Nhập mã phiếu, mã đơn hàng",
          },
        ]}
        dataExport={data}
        paramsDefault={paramsDefault}
        arrNoneRenderSliderFilter={["confirmed_date_dateValue", "created_dateValue"]}
        columnShowExport={columnShowExport}
        contentGetValue={contentGetValueExport}
        dataRenderHeader={dataRenderHeader}
        params={newParamsStore}
        columnsCount={stocktaking.countShowColumn}
        originColumns={stocktaking.columnsShow}
        onChangeColumn={handleChangeColumn}
        handleRefresh={handleRefresh}
        contentArrButtonOptional={contentArrButtonOptional}
        handleFilter={handleFilter}
        onToggleModeTable={handleShowFullTable}
      />
    );
  };

  const columnOrders = useMemo(() => {
    return stocktaking.resultColumnsShow.map((item) => item.name);
  }, [stocktaking.resultColumnsShow]);

  return (
    <>
      <DDataGrid
        isFullTable={isShowFullTable}
        data={data}
        dataTotal={dataTotal}
        page={params.page}
        pageSize={params.limit}
        isLoadingTable={loading}
        columns={stocktaking.resultColumnsShow}
        columnWidths={stocktaking.columnsWidthResize}
        columnOrders={columnOrders}
        renderHeader={renderHeader}
        isCheckAll={data.length && data.length === stocktaking.columnSelected.length}
        listTabDetail={["stocktaking"]}
        contentOptional={{
          arrColumnOptional: ["warehouse"],
        }}
        arrColumnHandleLink={["code", "order_number"]}
        arrAttachUnitVnd={["sale_price", "purchase_price"]}
        arrColumnThumbImg={["thumb_img"]}
        arrColumnEditLabel={["is_confirm"]}
        setColumnWidths={handleResizeColumns}
        handleChangeColumnOrder={handleChangeColumnOrder}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleChangePage={handleChangePage}
        handleCheckColumn={handleCheckColumn}
        handleCheckedAll={handleCheckedAll}
      />
    </>
  );
};

export default Stocktakings;
