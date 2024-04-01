// Libraries
import { useState, useEffect, useContext } from "react";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import map from "lodash/map";

// Services
import { productApi } from "_apis_/product";

// Context
import { DetailVariantContext } from "views/ProductView/containers/DetailVariant/context";

// Components
import DataGrid from "components/DataGrid";
import TableDetailNoneApi from "components/DataGrid/components/TableDetailNoneApi";
import { TabWrap } from "components/Tabs";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";

// Types
import { ColumnTypeDefault } from "_types_/ColumnType";
import { InventoryType } from "_types_/WarehouseType";

// Constants & Utils
import {
  columnShowInventory,
  columnShowInventoryDetailWarehouse,
} from "views/ProductView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { fDate } from "utils/dateUtil";
import { dd_MM_yyyy } from "constants/time";
import { chooseParams } from "utils/formatParamsUtil";
import { getColumnsShow, handleChangeColumnOrders } from "utils/tableUtil";

const Inventory = () => {
  const { variantId: variant, isRefresh } = useContext(DetailVariantContext);

  // State
  const [columnWidths, setColumnWidths] = useState<TableColumnWidthInfo[]>(
    columnShowInventory.columnWidths
  );
  const [columnsShowHeader, setColumnsShowHeader] = useState<ColumnTypeDefault<InventoryType>[]>(
    getColumnsShow(columnShowInventory.columnsShowHeader)
  );
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [params, setParams] = useState({ page: 1, limit: 200 });

  useEffect(() => {
    if (variant) {
      getListInventory(
        chooseParams(
          {
            ...params,
            variant,
          },
          ["variant"]
        )
      );
    }
  }, [isRefresh, params]);

  const getListInventory = async (params: Partial<unknown>) => {
    setLoading(true);

    const result: any = await productApi.get(params, "inventory/variant-batch/");

    if (result && result.data) {
      const { results = [] } = result.data;
      const newData = results.map((item: any) => {
        return {
          ...item,
          batch_name: getObjectPropSafely(() => item.variant_batch.batch_name),
          expiry_date: fDate(
            getObjectPropSafely(() => item.variant_batch.expiry_date),
            dd_MM_yyyy
          ),
        };
      });

      setData(newData);
    }

    setLoading(false);
  };

  const handleOrderColumn = (columns: any) => {
    const newColumns = handleChangeColumnOrders(columns, columnsShowHeader);

    setColumnsShowHeader(newColumns.resultColumnsShow);
  };

  const renderTableDetail = (row: any, value: number) => {
    const newInventory: { quantity: number; warehouse: string }[] = map(
      row.inventories,
      (item) => ({
        quantity: item.quantity,
        warehouse: getObjectPropSafely(() => item.warehouse.name),
      })
    );

    return (
      <TabWrap value={value} index={0}>
        <TableDetailNoneApi
          isHeightCustom
          data={newInventory}
          columnShowDetail={columnShowInventoryDetailWarehouse}
        />
      </TabWrap>
    );
  };

  const renderHeader = () => {
    return (
      <HeaderFilter
        dataExport={data}
        columns={{
          columnsShow: columnShowInventory.columnsShowHeader,
          resultColumnsShow: columnShowInventory.columnsShowHeader,
          columnShowExport: columnShowInventory.columnShowTable,
        }}
      />
    );
  };

  return (
    <DataGrid
      heightProps={700}
      data={data}
      isLoadingTable={isLoading}
      renderTableDetail={renderTableDetail}
      renderHeader={renderHeader}
      columns={columnsShowHeader}
      columnWidths={columnWidths}
      contentColumnShowInfo={{
        arrColumnShowInfo: ["batch_name", "expiry_date", "quantity"],
        infoCell: columnShowInventory.columnShowTable,
      }}
      setColumnWidths={setColumnWidths}
      handleChangeColumnOrder={handleOrderColumn}
    />
  );
};

export default Inventory;
