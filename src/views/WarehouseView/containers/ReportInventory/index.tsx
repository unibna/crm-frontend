// Libraries
import { useEffect, useReducer, useMemo } from "react";
import map from "lodash/map";
import filter from "lodash/filter";
import find from "lodash/find";
import reduce from "lodash/reduce";
import flatMap from "lodash/flatMap";
import forEach from "lodash/forEach";
import omit from "lodash/omit";
import produce from "immer";
import { useTheme } from "@mui/material/styles";

// Services
import { productApi } from "_apis_/product";

// Context & Hooks
import { useCancelToken } from "hooks/useCancelToken";
import { useAppSelector } from "hooks/reduxHook";
import { getAllAttributesWarehouse } from "selectors/attributes";

// Components
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import DDataGrid from "components/DDataGrid";
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";
import { TabWrap } from "components/Tabs";
import { Span } from "components/Labels";
import TableDetailNoneApi from "components/DDataGrid/components/TableDetailNoneApi";
import MImage from "components/Images/MImage";
import Image from "components/Images/Image";

// Types
import { SortType } from "_types_/SortType";
import { FacebookType, InitialStateReport } from "_types_/FacebookType";
import { ColumnTypeDefault } from "_types_/ColumnType";

// Constants & Utils
import {
  actionType,
  keyFilter,
  columnShowReportInventory,
  paramsDefault,
  columnShowReportInventoryDetailVariant,
  columnShowReportInventoryDetailBatch,
} from "views/WarehouseView/constants";
import { chooseParams, handleParamsHeaderFilter } from "utils/formatParamsUtil";
import { ALL_OPTION, TYPE_FORM_FIELD } from "constants/index";
import { fDate } from "utils/dateUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import logoIcon from "assets/images/icon-logo.png";
import { STATUS_PRODUCT } from "_types_/ProductType";

// --------------------------------------------------------------------

const initState: InitialStateReport = {
  data: [],
  loading: false,
  params: {
    page: 1,
    limit: 200,
    ordering: "",
    ...paramsDefault,
  },
  columns: {
    columnsShowHeader: filter(
      columnShowReportInventory.columnsShowHeader,
      (item: ColumnTypeDefault<FacebookType>) => item.isShow
    ),
    columnsShow: filter(
      columnShowReportInventory.columnsShowHeader,
      (item: ColumnTypeDefault<FacebookType>) => item.isShow
    ),
    columnOrders: [],
    columnWidths: columnShowReportInventory.columnWidths,
  },
  dataTotal: 0,
  totalRow: {},
  isShowFullTable: false,
};

const storeReportInventory = (state: InitialStateReport, action: any) => {
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
      case actionType.UPDATE_TOTAL_ROW: {
        return {
          ...state,
          ...payload,
        };
      }
      case actionType.UPDATE_SHOW_FULL_TABLE: {
        return {
          ...state,
          ...payload,
        };
      }
      case actionType.UPDATE_COLUMNS_REPORT: {
        return {
          ...state,
          columns: {
            ...state.columns,
            ...payload,
          },
        };
      }
    }
  }
};

const ReportInventory = () => {
  const theme = useTheme();
  const attributesWarehouse = useAppSelector((state) =>
    getAllAttributesWarehouse(state.attributes)
  );
  const { listWarehouse } = attributesWarehouse;
  const [state, dispatch] = useReducer(storeReportInventory, initState);
  const { newCancelToken } = useCancelToken();

  const {
    data,
    loading,
    params,
    dataTotal,
    isShowFullTable,
    totalRow,
    columns: { columnsShowHeader, columnOrders, columnWidths, columnsShow },
  } = state;

  const filterWarehouseDefault: any = useMemo(() => {
    return find(listWarehouse, (item) => item.is_default) || listWarehouse[0];
  }, [listWarehouse]);

  useEffect(() => {
    const newColumnOrder = map(columnsShowHeader, (item: any) => item.name);
    dispatch({
      type: actionType.UPDATE_COLUMNS_REPORT,
      payload: {
        columnOrders: newColumnOrder,
      },
    });

    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        warehouse_id: getObjectPropSafely(() => filterWarehouseDefault.value),
      },
    });
  }, [filterWarehouseDefault]);

  useEffect(() => {
    loadDataTable();
  }, [params]);

  const loadDataTable = () => {
    const listWarehouseValue = listWarehouse.slice(1).map((item) => item.value);
    const objParams = {
      ...params,
      date_from: params.created_from,
      date_to: params.created_to,
      id: params.warehouse_id === "all" ? listWarehouseValue : params.warehouse_id,
    };

    const newParams = chooseParams(objParams, ["date_from", "date_to", "id", "search"]);
    if (newParams.id) {
      getListReportInventory(newParams);
    }
  };

  const getListReportInventory = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: true,
        },
      });

      const result = await productApi.get(params, `warehouse/report/`);

      if (result && result.data) {
        const { results = [], count, total } = result.data;
        const newData = map(results, (item: FacebookType | any) => {
          return {
            ...item,
            product_name: {
              content: (
                <Grid container wrap="nowrap" direction="row" alignItems="center">
                  <MImage src={item?.image?.url || logoIcon} preview />
                  <Typography variant="body2" className="ellipsis-label">
                    {getObjectPropSafely(() => item.product_name)}
                  </Typography>
                </Grid>
              ),
            },
            product_c_import: {
              content: (
                <Span variant={theme.palette.mode === "light" ? "ghost" : "filled"} color="success">
                  {item.product_c_import}
                </Span>
              ),
            },
            product_c_export: {
              content: (
                <Span variant={theme.palette.mode === "light" ? "ghost" : "filled"} color="error">
                  {item.product_c_export}
                </Span>
              ),
            },
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

        dispatch({
          type: actionType.UPDATE_TOTAL_ROW,
          payload: {
            totalRow: total,
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
    dispatch({
      type: actionType.UPDATE_COLUMNS_REPORT,
      payload: {
        columnWidths: value,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatch({
      type: actionType.UPDATE_COLUMNS_REPORT,
      payload: {
        columnOrders: columns,
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

  const handleChangeSorting = (value: SortType[]) => {
    const ordering = value[0].direction === "asc" ? value[0].columnName : "-" + value[0].columnName;

    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        ordering,
      },
    });
  };

  const handleChangeColumn = (column: { name: string; isShow: boolean; title: string }) => {
    const index = columnShowReportInventory.columnsShowHeader.findIndex(
      (item: { name: string }) => item.name === column.name
    );
    const columnsShow: any = produce(
      columnShowReportInventory.columnsShowHeader,
      (draft: ColumnTypeDefault<FacebookType>[]) => {
        draft[index].isShow = !column.isShow;
      }
    );

    const resultColumnsShow = column.isShow
      ? filter(columnsShowHeader, (item: any) => item.name !== column.name)
      : filter(columnsShow, (item: ColumnTypeDefault<FacebookType>) => item.isShow);

    dispatch({
      type: actionType.UPDATE_COLUMNS_REPORT,
      payload: {
        columnsShowHeader: resultColumnsShow,
        columnsShow,
      },
    });
  };

  const handleFilter = (params: any) => {
    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        page: 1,
        ...params,
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

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(params, [
      "created_from",
      "created_to",
      "created_dateValue",
      "warehouse_id",
    ]);
  }, [params]);

  const columnShowExport = useMemo(() => {
    return columnShowReportInventoryDetailBatch.columnsShowHeader.length
      ? [
          {
            name: "variant_name",
            title: "Sản phẩm",
          },
          {
            name: "variant_SKU_code",
            title: "SKU",
          },
          ...reduce(
            columnShowReportInventoryDetailBatch.columnsShowHeader,
            (prevArr: any, current: any) => {
              return [
                ...prevArr,
                {
                  name: current.name,
                  title: current.title,
                },
              ];
            },
            []
          ),
        ]
      : [];
  }, [columnsShowHeader]);

  const dataExport = useMemo(() => {
    let newData: any = [];
    const listVariant = flatMap(data, (item) => item.variants);
    forEach(listVariant, (item) => {
      const arrValue = map(item.batches, (current) => ({
        ...current,
        variant_name: item.variant_name,
        variant_SKU_code: item.variant_SKU_code,
      }));

      newData = [...newData, ...arrValue];
    });

    return newData;
  }, [data]);

  const renderHeader = () => {
    const dataRenderHeader = [
      {
        style: {
          width: 200,
        },
        status: keyFilter.WAREHOUSE,
        title: "Kho",
        options: [ALL_OPTION, ...listWarehouse],
        label: "warehouse_id",
        defaultValue: getObjectPropSafely(() => filterWarehouseDefault.value) || "",
      },
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
            label: "Nhập SKU, tên sản phẩm",
          },
        ]}
        dataRenderHeader={dataRenderHeader}
        params={newParamsStore}
        paramsDefault={{
          ...omit(paramsDefault, ["is_deleted"]),
          warehouse_id: getObjectPropSafely(() => filterWarehouseDefault.value),
        }}
        dataExport={dataExport}
        columnShowExport={columnShowExport}
        arrNoneRenderSliderFilter={["created_dateValue"]}
        columnsCount={columnsShowHeader.length}
        originColumns={columnsShow}
        onChangeColumn={handleChangeColumn}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        onToggleModeTable={handleShowFullTable}
      />
    );
  };

  const renderTableDetailBatch = (row: any, value: number) => {
    const newData = map(row.batches, (item) => ({
      ...item,
      expiry_date: fDate(item.expiry_date),
      c_import: {
        content: (
          <Span variant={theme.palette.mode === "light" ? "ghost" : "filled"} color="success">
            {item.c_import}
          </Span>
        ),
      },
      c_export: {
        content: (
          <Span variant={theme.palette.mode === "light" ? "ghost" : "filled"} color="error">
            {item.c_export}
          </Span>
        ),
      },
    }));

    return (
      <TabWrap value={value} index={0}>
        <TableDetailNoneApi
          isHeightCustom
          data={newData}
          columnShowDetail={columnShowReportInventoryDetailBatch}
          contentOptional={{
            arrColumnOptional: ["c_export", "c_import"],
          }}
        />
      </TabWrap>
    );
  };

  const renderTableDetail = (row: any, value: number) => {
    const newData = map(row.variants, (item) => ({
      ...item,
      variant_c_import: {
        content: (
          <Span variant={theme.palette.mode === "light" ? "ghost" : "filled"} color="success">
            {item.variant_c_import}
          </Span>
        ),
      },
      variant_c_export: {
        content: (
          <Span variant={theme.palette.mode === "light" ? "ghost" : "filled"} color="error">
            {item.variant_c_export}
          </Span>
        ),
      },
      variant_name: {
        value: item.variant_name,
        valueItem: {
          ...item,
          id: item.variant_id,
          SKU_code: item.variant_SKU_code,
          image: getObjectPropSafely(() => item.image)
            ? [getObjectPropSafely(() => item.image)]
            : [],
          created_by: "",
          modified_by: "",
          status: STATUS_PRODUCT.ACTIVE,
          name: item.variant_name,
          value: item.variant_name,
        },
      },
    }));

    return (
      <TabWrap value={value} index={0}>
        <Stack sx={{ minWidth: 1500 }}>
          <TableDetailNoneApi
            isHeightCustom
            data={newData}
            renderTableDetail={renderTableDetailBatch}
            columnShowDetail={columnShowReportInventoryDetailVariant}
            contentOptional={{
              arrColumnOptional: ["variant_c_export", "variant_c_import"],
            }}
            contentColumnDetailProduct={{
              arrColumnDetailProduct: ["variant_name"],
            }}
          />
        </Stack>
      </TabWrap>
    );
  };

  return (
    <DDataGrid
      isFullTable={isShowFullTable}
      data={data}
      dataTotal={dataTotal}
      totalSummaryRow={totalRow}
      page={params.page}
      pageSize={params.limit}
      columns={columnsShowHeader}
      columnOrders={columnOrders}
      columnWidths={columnWidths}
      isLoadingTable={loading}
      renderTableDetail={renderTableDetail}
      contentOptional={{
        arrColumnOptional: ["product_name", "product_c_import", "product_c_export"],
      }}
      renderHeader={renderHeader}
      setColumnWidths={handleResizeColumns}
      handleChangeColumnOrder={handleChangeColumnOrder}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      handleSorting={handleChangeSorting}
    />
  );
};

export default ReportInventory;
