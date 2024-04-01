// Libraries
import { useContext, useEffect, useState } from "react";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { Grid } from "@mui/material";

// Components
import DataGrid from "components/DataGrid";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";

// Contexts
import { ReportContext } from "../context";

// Constants & Utils
import { ROLE_TAB } from "constants/rolesTab";
import { ALL_OPTION, ActionType } from "constants/index";
import {
  getColumnsShow,
  handleChangeColumnOrders,
  handleToggleVisibleColumn,
} from "utils/tableUtil";
import {
  OPTIONS_REPORT_DIMENSIONS,
  OPTIONS_SHEET_TYPE,
  REPORT_DIMENSIONS,
  columnShowReportInventoryActivities,
  dataRenderHeaderDefault,
} from "../constants";

// Services
import { productApi } from "_apis_/product";

// Types
import { SortType } from "_types_/SortType";
import { MColumnType } from "_types_/ColumnType";
import { IReportInventoryActivities } from "_types_/WarehouseType";
import { useAppSelector } from "hooks/reduxHook";
import { getAllAttributesWarehouse } from "selectors/attributes";
import { Span } from "components/Labels";
import { MultiSelect } from "components/Selectors";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

function ReportContainer() {
  const { state, dispatch } = useContext(ReportContext);
  const attributesWarehouse = useAppSelector((state) =>
    getAllAttributesWarehouse(state.attributes)
  );
  const { listWarehouse: dataWarehouse } = attributesWarehouse;
  const {
    columnsShow = [],
    resultColumnsShow = [],
    columnsWidthResize = [],
    countShowColumn = 0,
  } = state.columns || {};
  const { page, limit } = state.params;

  const [dataTotal, setDataTotal] = useState<number>(0);
  const [isShowFullTable, setShowFullTable] = useState(false);
  const [isLoadingTable, setLoadingTable] = useState(false);
  const [totalRow, setTotalRow] = useState({});
  const [data, setData] = useState<IReportInventoryActivities[]>([]);

  const handleResizeColumn = (columns: TableColumnWidthInfo[]) => {
    dispatch({
      type: "columns",
      payload: {
        columnsWidthResize: columns,
      },
    });
  };

  const handleOrderColumn = (columns: string[]) => {
    const newColumns = handleChangeColumnOrders(columns, resultColumnsShow);
    dispatch({
      type: "columns",
      payload: {
        resultColumnsShow: newColumns.resultColumnsShow,
      },
    });
  };

  const handleChangePage = (page: number) =>
    dispatch({
      type: ActionType.UPDATE_PARAMS,
      payload: {
        page,
      },
    });

  const handleChangeRowsPerPage = (limit: number) =>
    dispatch({
      type: ActionType.UPDATE_PARAMS,
      payload: {
        page: 1,
        limit,
      },
    });

  const handleChangeSorting = (value: SortType[]) => {
    const ordering = value[0].direction === "asc" ? value[0].columnName : "-" + value[0].columnName;

    dispatch({
      type: ActionType.UPDATE_PARAMS,
      payload: {
        ordering,
      },
    });
  };

  const handleChangeColumn = (columns: MColumnType) => {
    const newColumns = handleToggleVisibleColumn(columns, columnsShow);

    dispatch({
      type: "columns",
      payload: { ...newColumns },
    });
  };

  const handleFilter = (paramsProps: any) => {
    dispatch({
      type: ActionType.UPDATE_PARAMS,
      payload: {
        ...paramsProps,
        page: 1,
      },
    });
  };

  const handleRefresh = () => {
    loadDataTable();
  };

  const loadDataTable = async () => {
    setLoadingTable(true);

    const newParams = {
      ...state.params,
      sheet_type: state.params.sheet_type === "all" ? undefined : state.params.sheet_type,
      warehouse: state.params.warehouse === "all" ? undefined : state.params.warehouse,
      dimentions:
        state.params.dimentions === "all"
          ? Object.keys(REPORT_DIMENSIONS)
          : state.params.dimentions,
    };

    const result = await productApi.get(newParams, "warehouse/report-operation/");
    if (result?.data) {
      const { results = [], count = 0 } = result.data;
      const newData: IReportInventoryActivities[] = results.map(
        (item: IReportInventoryActivities) => ({
          ...item,
          sheet__sheet_reason__type: {
            value: item.sheet__sheet_reason__type,
            content: (
              <Span
                color={
                  OPTIONS_SHEET_TYPE.find(
                    (option: any) => option.value === item.sheet__sheet_reason__type
                  )?.color
                }
              >
                {
                  OPTIONS_SHEET_TYPE.find(
                    (option: any) => option.value === item.sheet__sheet_reason__type
                  )?.label
                }
              </Span>
            ),
          },
          variant_batch__variant__name: {
            value: item.variant_batch__variant__name,
            props: {
              href: `/${ROLE_TAB.PRODUCT}/${item.variant_batch__variant__id}`,
            },
          },
        })
      );

      setData(newData);
      setDataTotal(count);
    }
    setLoadingTable(false);
  };

  useEffect(() => {
    loadDataTable();
  }, [state.params]);

  const handleSwitchColumnByFilterReport = (value: string | any) => {
    let newColumns = {
      columnsShow: getColumnsShow(columnShowReportInventoryActivities.columnShowTable),
      countShowColumn: getColumnsShow(columnShowReportInventoryActivities.columnShowTable).length,
    };

    const defaultColumns = ["quantity_import", "quantity_export"];

    if (value !== "all") {
      const newColumnShowTable = columnShowReportInventoryActivities.columnShowTable.map((item) =>
        !(
          defaultColumns.includes(item.name) ||
          OPTIONS_REPORT_DIMENSIONS.some(
            (option: any) => value.includes(option.value) && option.columns?.includes(item.name)
          )
        )
          ? {
              ...item,
              isShow: false,
            }
          : item
      );
      newColumns = {
        columnsShow: newColumnShowTable,
        countShowColumn: newColumnShowTable.length,
      };
    }
    dispatch({
      type: "columns",
      payload: {
        ...newColumns,
      },
    });
  };

  const contentOptionalLeft = (
    <MultiSelect
      zIndex={1303}
      title="Báo cáo theo"
      size="small"
      outlined
      fullWidth
      selectorId="report_by"
      options={OPTIONS_REPORT_DIMENSIONS}
      onChange={(value) => {
        dispatch({
          type: ActionType.UPDATE_PARAMS,
          payload: {
            dimentions: value,
          },
        });
        handleSwitchColumnByFilterReport(value);
      }}
      defaultValue={state.params?.dimentions}
      style={{ marginTop: 0 }}
    />
  );

  const renderHeader = () => {
    const finalDataRenderHeader = [
      ...dataRenderHeaderDefault,
      {
        style: {
          width: 200,
        },
        title: "Kho",
        options: [ALL_OPTION, ...dataWarehouse],
        label: "warehouse",
        defaultValue: "",
      },
      {
        style: {
          width: 200,
        },
        title: "Lý do nhập kho",
        options: attributesWarehouse.importReason,
        label: "reason_imports",
        defaultValue: getObjectPropSafely(() => attributesWarehouse.importReason[0].value) || "",
      },
      {
        style: {
          width: 200,
        },
        title: "Lý do xuất kho",
        options: attributesWarehouse.exportReason,
        label: "reason_exports",
        defaultValue: getObjectPropSafely(() => attributesWarehouse.exportReason[0].value) || "",
      },
      {
        style: {
          width: 200,
        },
        title: "Lý do chuyển hàng",
        options: attributesWarehouse.transferReason,
        label: "reason_transfer",
        defaultValue: getObjectPropSafely(() => attributesWarehouse.transferReason[0].value) || "",
      },
    ];
    return (
      <HeaderFilter
        isShowPopupFilter
        isFullTable={isShowFullTable}
        searchInput={[
          {
            keySearch: "search",
            label: "Nhập lí do, tên sản phẩm, SKU, tên lô",
            style: { width: 400 },
          },
        ]}
        columns={{
          columnsShow,
          columnsWidthResize,
          resultColumnsShow,
          countShowColumn: countShowColumn,
          columnShowExport: columnsShow,
        }}
        params={state.params}
        dataExport={data}
        dataRenderHeader={finalDataRenderHeader}
        contentOptionalLeft={contentOptionalLeft}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        onChangeColumn={handleChangeColumn}
        onToggleModeTable={() => setShowFullTable(!isShowFullTable)}
      />
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
        <DataGrid
          isFullTable={isShowFullTable}
          data={data}
          dataTotal={dataTotal}
          page={page}
          pageSize={limit}
          columns={resultColumnsShow}
          totalSummaryRow={totalRow}
          columnWidths={columnsWidthResize}
          isLoadingTable={isLoadingTable}
          renderHeader={renderHeader}
          handleSorting={handleChangeSorting}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleChangePage={handleChangePage}
          setColumnWidths={handleResizeColumn}
          handleChangeColumnOrder={handleOrderColumn}
          contentColumnShowInfo={{
            arrColumnShowInfo: columnsShow?.map((column) => column.name) || [],
            infoCell: columnsShow || [],
          }}
          arrColumnHandleLink={["variant_batch__variant__name"]}
          contentOptional={{ arrColumnOptional: ["sheet__sheet_reason__type"] }}
          arrDate={["sheet__confirmed_date__date"]}
        />
      </Grid>
    </Grid>
  );
}

export default ReportContainer;
