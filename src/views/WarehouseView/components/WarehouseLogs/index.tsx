// Libraries
import { useState, useEffect, useReducer } from "react";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import map from "lodash/map";

// Services
import { productApi } from "_apis_/product";

// Hooks
import { useCancelToken } from "hooks/useCancelToken";

// Components
import DataGrid from "components/DataGrid";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";

// @Types
import { WarehouseType } from "_types_/WarehouseType";
import { InitialState } from "_types_/FacebookType";
import { ColumnTypeDefault } from "_types_/ColumnType";

// Constants & Utils
import {
  columnShowListWarehouseLogs,
  actionType,
  NameSheetWarehouse,
  keyFilter,
  dataFilterSheetType,
  dataFilterDraft,
  defaultHiddenColumns,
} from "views/WarehouseView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { fDateTime } from "utils/dateUtil";
import { handleParamsApi } from "utils/formatParamsUtil";
import { ALL_OPTION, TYPE_FORM_FIELD } from "constants/index";
import { ROLE_TAB, STATUS_ROLE_WAREHOUSE } from "constants/rolesTab";
import {
  getColumnsShow,
  handleChangeColumnOrders,
  handleToggleVisibleColumn,
} from "utils/tableUtil";
import { useLocation } from "react-router-dom";
import { PATH_DASHBOARD } from "routes/paths";
import { useAppSelector } from "hooks/reduxHook";
import { getAllAttributesWarehouse } from "selectors/attributes";

// -------------------------------------------------------------------
interface Props {
  data: WarehouseType;
}

const initState: InitialState = {
  data: [],
  loading: false,
  params: {
    page: 1,
    limit: 200,
    ordering: "",
  },
  dataTotal: 0,
  isShowFullTable: false,
};

const storeWarehouseLogs = (state: InitialState, action: any) => {
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

const WarehouseLogs = (props: Props) => {
  const { data: dataProps } = props;
  const { newCancelToken } = useCancelToken();
  const [state, dispatch] = useReducer(storeWarehouseLogs, initState);
  const { pathname } = useLocation();
  const attributesWarehouse = useAppSelector((state) =>
    getAllAttributesWarehouse(state.attributes)
  );
  const { listWarehouse: dataWarehouse } = attributesWarehouse;

  const isWarehouseLogsPage =
    pathname === `/${PATH_DASHBOARD[ROLE_TAB.WAREHOUSE][STATUS_ROLE_WAREHOUSE.WAREHOUSE_LOGS]}`;

  // State
  const [paramsStore, setParamsStore] = useState<any>({});
  const [columnWidths, setColumnWidths] = useState<TableColumnWidthInfo[]>(
    columnShowListWarehouseLogs.columnWidths
  );
  const [columnsShowHeader, setColumnsShowHeader] = useState<ColumnTypeDefault<any>[]>(
    getColumnsShow(columnShowListWarehouseLogs.columnsShowHeader)
  );
  const [columnsShow, setColumnsShow] = useState<ColumnTypeDefault<any>[]>(
    getColumnsShow(columnShowListWarehouseLogs.columnsShowHeader)
  );
  const { data, loading, params, dataTotal, isShowFullTable } = state;

  useEffect(() => {
    if (!isWarehouseLogsPage) {
      const newColumnsShow = columnShowListWarehouseLogs.columnsShowHeader.map((item) => ({
        ...item,
        isShow: !defaultHiddenColumns.includes(item.name),
      }));
      setColumnsShowHeader(getColumnsShow(newColumnsShow));
      setColumnsShow(newColumnsShow);
    }
  }, [isWarehouseLogsPage]);

  useEffect(() => {
    if (dataProps || isWarehouseLogsPage) {
      loadDataTable();
    }
  }, [params, paramsStore, pathname]);

  const loadDataTable = () => {
    const objParams = handleParamsApi(
      {
        ...params,
        ...paramsStore,
        warehouse: isWarehouseLogsPage ? paramsStore.warehouse : dataProps?.id,
      },
      ["warehouse", "search", "created_from", "created_to", "is_draft", "sheet_type"]
    );

    getListWarehouseLogs(objParams);
  };

  const getListWarehouseLogs = async (params: Partial<unknown>) => {
    dispatch({
      type: actionType.UPDATE_LOADING,
      payload: {
        loading: true,
      },
    });

    const result: any = await productApi.get(
      {
        ...params,
        cancelToken: newCancelToken(),
      },
      "inventory/logs/"
    );

    if (result && result.data) {
      const { results = [], count } = result.data;
      const newData = map(results, (item: any) => {
        return {
          ...item,
          variant_batch: getObjectPropSafely(() => item.variant_batch.batch_name),
          thumb_img_variant: getObjectPropSafely(() => item.variant_batch.variant.image.url),
          warehouse: getObjectPropSafely(() => item.warehouse.name),
          quantity: {
            value: item.quantity,
            color: item.quantity < 0 ? "error" : "success",
          },
          sheet: getObjectPropSafely(
            () => NameSheetWarehouse[item.sheet.type as keyof typeof NameSheetWarehouse]
          ),
          confirmed_by: getObjectPropSafely(() => item.sheet.confirmed_by.name),
          confirmed_date: fDateTime(getObjectPropSafely(() => item.sheet.confirmed_date)),
          sheet_code: {
            value: getObjectPropSafely(() => item.sheet.code),
            props: {
              href: `/${STATUS_ROLE_WAREHOUSE.SHEET}/${getObjectPropSafely(() => item.sheet.id)}`,
            },
          },
          variant: {
            value: getObjectPropSafely(() => item.variant_batch.variant.name),
            props: {
              href: `/${ROLE_TAB.PRODUCT}/${getObjectPropSafely(
                () => item.variant_batch.variant.id
              )}`,
            },
          },
          is_draft: {
            value: !item.is_draft ? "Đã xác nhận" : "Chưa xác nhận",
            color: !item.is_draft ? "success" : "error",
          },
          SKU: getObjectPropSafely(() => item.variant_batch.variant.SKU_code),
          note: getObjectPropSafely(() => item.sheet.note),
          warehouse_name: getObjectPropSafely(() => item.warehouse.name),
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

  const handleShowFullTable = () => {
    dispatch({
      type: actionType.UPDATE_SHOW_FULL_TABLE,
      payload: {
        isShowFullTable: !isShowFullTable,
      },
    });
  };

  const handleFilter = (params: any) => {
    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        page: 1,
      },
    });

    setParamsStore({
      ...paramsStore,
      ...params,
    });
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const handleOrderColumn = (columns: any) => {
    const newColumns = handleChangeColumnOrders(columns, columnsShowHeader);
    setColumnsShowHeader(newColumns.resultColumnsShow);
  };

  const handleChangeColumn = (column: any) => {
    const newColumns = handleToggleVisibleColumn(column, columnsShow);
    setColumnsShowHeader(getColumnsShow(newColumns.columnsShow));
    setColumnsShow(newColumns.columnsShow);
  };

  const renderHeader = () => {
    const dataRenderHeader = [
      {
        style: {
          width: 200,
        },
        status: keyFilter.IS_DRAFT,
        title: "Trạng thái xác nhận",
        options: dataFilterDraft,
        label: "is_draft",
        defaultValue: getObjectPropSafely(() => dataFilterDraft[0].value) || "",
      },
      {
        style: {
          width: 200,
        },
        status: keyFilter.SHEET_TYPE,
        title: "Phiếu kho",
        options: dataFilterSheetType,
        label: "sheet_type",
        defaultValue: getObjectPropSafely(() => dataFilterSheetType[0].value) || "",
      },
      ...(isWarehouseLogsPage
        ? [
            {
              style: {
                width: 200,
              },
              status: keyFilter.WAREHOUSE,
              title: "Kho",
              options: [ALL_OPTION, ...dataWarehouse],
              label: "warehouse",
              defaultValue: "",
            },
          ]
        : []),
      {
        type: TYPE_FORM_FIELD.DATE,
        title: "Thời gian tạo",
        keyDateFrom: "created_from",
        keyDateTo: "created_to",
        keyDateValue: "created_dateValue",
      },
    ];

    return (
      <HeaderFilter
        isFullTable={isShowFullTable}
        searchInput={[
          {
            keySearch: "search",
            label: "Nhập tên sản phẩm, mã phiếu kho",
          },
        ]}
        dataExport={data}
        columns={{
          resultColumnsShow: columnsShowHeader,
          columnsWidthResize: columnWidths,
          columnShowExport: columnShowListWarehouseLogs.columnShowTable,
          columnsShow: columnsShow,
          countShowColumn: columnsShow.length,
        }}
        params={paramsStore}
        dataRenderHeader={dataRenderHeader}
        arrNoneRenderSliderFilter={["created_dateValue"]}
        onChangeColumn={handleChangeColumn}
        handleRefresh={handleRefresh}
        handleFilter={handleFilter}
        onToggleModeTable={handleShowFullTable}
      />
    );
  };

  return (
    <DataGrid
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      isLoadingTable={loading}
      columns={columnsShowHeader}
      columnWidths={columnWidths}
      renderHeader={renderHeader}
      arrColumnThumbImg={["variant"]}
      arrColumnEditLabel={["is_draft", "quantity"]}
      arrColumnHandleLink={["sheet_code", "variant"]}
      contentColumnShowInfo={{
        arrColumnShowInfo: [
          "variant_batch",
          "created",
          "variant",
          "quantity",
          "sheet_code",
          "is_draft",
          "sheet",
          "confirmed_by",
          "confirmed_date",
        ],
        infoCell: columnShowListWarehouseLogs.columnShowTable,
      }}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      setColumnWidths={setColumnWidths}
      handleChangeColumnOrder={handleOrderColumn}
    />
  );
};

export default WarehouseLogs;
