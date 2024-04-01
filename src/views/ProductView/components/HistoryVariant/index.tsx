// Libraries
import { useState, useEffect, useContext } from "react";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { useTheme } from "@mui/material/styles";

// Services
import { productApi } from "_apis_/product";

// Context
import { DetailVariantContext } from "views/ProductView/containers/DetailVariant/context";

// Components
import DataGrid from "components/DataGrid";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";

// @Types
import { ColumnTypeDefault } from "_types_/ColumnType";
import { HistoryVariant as HistoryVariantType } from "_types_/ProductType";

// Constants & Utils
import { columnShowInventoryDetailHistoryVariant } from "views/ProductView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { NameSheetWarehouse } from "views/WarehouseView/constants";
import { STATUS_ROLE_WAREHOUSE } from "constants/rolesTab";
import { chooseParams } from "utils/formatParamsUtil";
import { getColumnsShow, handleChangeColumnOrders } from "utils/tableUtil";

const HistoryVariant = () => {
  const theme = useTheme();
  const { variantId: variant, isRefresh, params: paramsStore } = useContext(DetailVariantContext);

  // State
  const [columnWidths, setColumnWidths] = useState<TableColumnWidthInfo[]>(
    columnShowInventoryDetailHistoryVariant.columnWidths
  );
  const [columnsShowHeader, setColumnsShowHeader] = useState<
    ColumnTypeDefault<HistoryVariantType>[]
  >(getColumnsShow(columnShowInventoryDetailHistoryVariant.columnsShowHeader));
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataTotal, setDataTotal] = useState(0);
  const [params, setParams] = useState({ page: 1, limit: 200, ordering: "-created" });

  useEffect(() => {
    if (variant) {
      getListHistoryVariant(
        chooseParams(
          {
            ...params,
            created_from: paramsStore.date_from,
            created_to: paramsStore.date_to,
            variant,
          },
          ["created_from", "created_to", "variant"]
        )
      );
    }
  }, [isRefresh, params, paramsStore]);

  const getListHistoryVariant = async (params: Partial<unknown>) => {
    setLoading(true);

    const result: any = await productApi.get(params, "inventory/logs/");

    if (result && result.data) {
      const { results = [], count } = result.data;
      const newData = results.map((item: any) => {
        return {
          ...item,
          variant_batch: getObjectPropSafely(() => item.variant_batch.batch_name),
          warehouse: {
            value: getObjectPropSafely(() => item.warehouse.name),
            color: "info",
          },
          sheet: NameSheetWarehouse[item?.sheet?.type as keyof typeof NameSheetWarehouse],
          quantity: {
            value: item.quantity,
            color: item.quantity < 0 ? "error" : "success",
          },
          is_draft: {
            value: item.is_draft ? "Chưa xác nhận" : "Đã xác nhận",
            color: item.is_draft ? "error" : "success",
          },
          sheet_code: {
            value: item.sheet.code,
            props: {
              href: `/${STATUS_ROLE_WAREHOUSE.SHEET}/${getObjectPropSafely(() => item.sheet.id)}`,
            },
          },
          order_number: {
            value: getObjectPropSafely(() => item.sheet.order_key),
            props: {
              href: `${window.location.origin}/orders/${getObjectPropSafely(
                () => item.sheet.order_id
              )}`,
              color: theme.palette.info.main,
            },
          },
        };
      });

      setData(newData);
      setDataTotal(count);
    }

    setLoading(false);
  };

  const handleOrderColumn = (columns: any) => {
    const newColumns = handleChangeColumnOrders(columns, columnsShowHeader);

    setColumnsShowHeader(newColumns.resultColumnsShow);
  };

  const renderHeader = () => {
    return (
      <HeaderFilter
        dataExport={data}
        columns={{
          columnsShow: columnShowInventoryDetailHistoryVariant.columnsShowHeader,
          resultColumnsShow: columnShowInventoryDetailHistoryVariant.columnsShowHeader,
          columnShowExport: columnShowInventoryDetailHistoryVariant.columnShowTable,
        }}
      />
    );
  };

  return (
    <DataGrid
      data={data}
      heightProps={700}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      isLoadingTable={isLoading}
      contentColumnShowInfo={{
        arrColumnShowInfo: [
          "warehouse_show",
          "quantity",
          "is_draft",
          "sheet",
          "sheet_code",
          "order_number",
          "created",
        ],
        infoCell: columnShowInventoryDetailHistoryVariant.columnShowTable,
      }}
      arrColumnEditLabel={["warehouse", "quantity", "is_draft"]}
      arrColumnHandleLink={["order_number", "sheet_code"]}
      renderHeader={renderHeader}
      columns={columnsShowHeader}
      columnWidths={columnWidths}
      handleChangeRowsPerPage={(rowPage: number) =>
        setParams({ ...params, limit: rowPage, page: 1 })
      }
      handleChangePage={(page: number) => setParams({ ...params, page })}
      setColumnWidths={setColumnWidths}
      handleChangeColumnOrder={handleOrderColumn}
    />
  );
};

export default HistoryVariant;
