// Libraries
import { useContext, useMemo, useReducer, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import map from "lodash/map";

// Services
import { productApi } from "_apis_/product";

// Context
import { StoreWarehouse } from "views/WarehouseView/contextStore";
import usePopup from "hooks/usePopup";
import { useAppSelector } from "hooks/reduxHook";
import { getAllAttributesWarehouse } from "selectors/attributes";
import { useCancelToken } from "hooks/useCancelToken";

// Components
import DDataGrid from "components/DDataGrid";
import AddIcon from "@mui/icons-material/Add";
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import ScanModal from "views/WarehouseView/components/ScanModal";

// @Types
import { InitialState } from "_types_/FacebookType";
import { SortType } from "_types_/SortType";
import { ColorSchema } from "_types_/ThemeColorType";

// Constants & Utils
import {
  actionType,
  keyFilter,
  dataFilterConfirm,
  message,
  handleDataApi,
  handleDataExport,
  contentGetValueExport,
  dataFilterSoftDeleted,
  paramsDefault,
} from "views/WarehouseView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { handleParamsApi } from "utils/formatParamsUtil";
import { handleParamsHeaderFilter } from "utils/formatParamsUtil";
import { statusNotification, TYPE_FORM_FIELD } from "constants/index";
import { STATUS_ROLE_WAREHOUSE } from "constants/rolesTab";
import { TypeWarehouseSheet } from "_types_/WarehouseType";

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

const storeImports = (state: InitialState, action: any) => {
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

const Imports = () => {
  const theme = useTheme();
  const { newCancelToken } = useCancelToken();
  const attributesWarehouse = useAppSelector((state) =>
    getAllAttributesWarehouse(state.attributes)
  );
  const [state, dispatch] = useReducer(storeImports, initState);
  const { state: store, dispatch: dispatchStore } = useContext(StoreWarehouse);
  const { setNotifications } = usePopup();
  const [isShowScan, setShowScan] = useState(false);

  const { imports, params: paramsStore } = store;
  const { data, params, dataTotal, loading, isShowFullTable } = state;

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore]);

  useEffect(() => {
    const newData = data.map((item: any) => {
      return {
        ...item,
        isCheck: imports.columnSelected.includes(item.id),
      };
    });

    dispatch({
      type: actionType.UPDATE_DATA,
      payload: {
        data: newData,
      },
    });
  }, [imports.columnSelected]);

  const loadDataTable = () => {
    const objParams = handleParamsApi(
      {
        ...params,
        ...paramsStore,
        type: TypeWarehouseSheet.IMPORTS,
        search: paramsStore.search_imports,
        is_confirm: paramsStore.is_confirm_imports,
        reason: paramsStore.reason_imports,
      },
      [
        "search",
        "type",
        "is_confirm",
        "is_deleted",
        "created_from",
        "created_to",
        "reason",
        "confirmed_date_from",
        "confirmed_date_to",
      ]
    );
    getListImports(objParams);
  };

  const getListImports = async (params: any) => {
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
        const newData = map(results, (item: any) => {
          return {
            ...item,
            ...handleDataApi(item, imports.columnSelected, { color: theme.palette.primary.main }),
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
      type: actionType.RESIZE_COLUMN_IMPORTS,
      payload: {
        columnsWidthResize: value,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_IMPORTS,
      payload: {
        columnsOrder: columns,
      },
    });
  };

  const handleChangeColumn = (column: any) => {
    dispatchStore({
      type: actionType.UPDATE_IMPORTS,
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

  const handleChangeSorting = (value: SortType[]) => {
    const ordering = value[0].direction === "asc" ? value[0].columnName : "-" + value[0].columnName;

    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        ordering,
      },
    });
  };

  const handleConfirmSheet = async () => {
    if (!imports.columnSelected.length) {
      setNotifications({
        message: "Vui lòng chọn phiếu để xác nhận",
        variant: statusNotification.WARNING,
      });

      return;
    }

    const params = {
      id_list: imports.columnSelected,
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

  const columnShowExport = useMemo(() => {
    return handleDataExport(imports.resultColumnsShow);
  }, [imports.resultColumnsShow]);

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(paramsStore, [
      "search_imports",
      "is_confirm_imports",
      "is_deleted",
      "reason_imports",
      "created_to",
      "created_from",
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
        label: "is_confirm_imports",
        defaultValue: getObjectPropSafely(() => dataFilterConfirm[0].value),
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
        title: "Lý do nhập kho",
        options: attributesWarehouse.importReason,
        label: "reason_imports",
        defaultValue: getObjectPropSafely(() => attributesWarehouse.importReason[0].value) || "",
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
        content: (
          <>
            <QrCodeScannerIcon /> Quét mã
          </>
        ),
        handleClick: () => setShowScan(true),
      },
      {
        content: <>Xác nhận phiếu</>,
        handleClick: handleConfirmSheet,
      },
      {
        content: (
          <>
            <AddIcon /> Nhập hàng
          </>
        ),
        handleClick: () =>
          window.open(`/${STATUS_ROLE_WAREHOUSE.SHEET}/new/${STATUS_ROLE_WAREHOUSE.IMPORTS}`),
      },
    ];

    return (
      <HeaderFilter
        isFullTable={isShowFullTable}
        searchInput={[
          {
            keySearch: "search_imports",
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
        columnsCount={imports.countShowColumn}
        originColumns={imports.columnsShow}
        onChangeColumn={handleChangeColumn}
        handleRefresh={handleRefresh}
        contentArrButtonOptional={contentArrButtonOptional}
        handleFilter={handleFilter}
        onToggleModeTable={handleShowFullTable}
      />
    );
  };

  const handleCheckColumn = (isCheck: boolean, row: any) => {
    let columnSelected = [...imports.columnSelected];
    if (isCheck) {
      columnSelected.push(row.id);
    } else {
      columnSelected = columnSelected.filter((item) => item !== row.id);
    }

    dispatchStore({
      type: actionType.UPDATE_COLUMN_SELECTED_IMPORTS,
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
      type: actionType.UPDATE_COLUMN_SELECTED_IMPORTS,
      payload: {
        columnSelected,
      },
    });
  };

  const columnOrders = useMemo(() => {
    return imports.resultColumnsShow.map((item) => item.name);
  }, [imports.resultColumnsShow]);

  return (
    <>
      <ScanModal
        open={isShowScan}
        handleClose={() => setShowScan(false)}
        type={TypeWarehouseSheet.IMPORTS}
      />
      <DDataGrid
        isFullTable={isShowFullTable}
        data={data}
        dataTotal={dataTotal}
        page={params.page}
        pageSize={params.limit}
        isLoadingTable={loading}
        columns={imports.resultColumnsShow}
        columnWidths={imports.columnsWidthResize}
        columnOrders={columnOrders}
        renderHeader={renderHeader}
        isCheckAll={data.length && data.length === imports.columnSelected.length}
        listTabDetail={["inventory"]}
        contentOptional={{
          arrColumnOptional: ["warehouse"],
        }}
        arrColumnHandleLink={["order_number", "code"]}
        arrAttachUnitVnd={["sale_price", "purchase_price"]}
        arrColumnThumbImg={["thumb_img"]}
        arrColumnEditLabel={["is_confirm"]}
        setColumnWidths={handleResizeColumns}
        handleChangeColumnOrder={handleChangeColumnOrder}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleChangePage={handleChangePage}
        handleSorting={handleChangeSorting}
        handleCheckColumn={handleCheckColumn}
        handleCheckedAll={handleCheckedAll}
      />
    </>
  );
};

export default Imports;
