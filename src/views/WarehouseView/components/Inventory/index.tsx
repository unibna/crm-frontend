// Libraries
import { useState, useEffect, useReducer, useMemo } from "react";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import map from "lodash/map";
import filter from "lodash/filter";

// Services
import { productApi } from "_apis_/product";

// Hooks
import { useCancelToken } from "hooks/useCancelToken";

// Components
import { InputAdornment, TextField } from "@mui/material";
import DataGrid from "components/DataGrid";
import HeaderFilter from "components/DataGrid/components/HeaderFilter";
import MDatePicker from "components/Pickers/MDatePicker";
import SearchIcon from "@mui/icons-material/Search";

// @Types
import { WarehouseType } from "_types_/WarehouseType";
import { InitialState } from "_types_/FacebookType";
import { ColumnTypeDefault } from "_types_/ColumnType";

// Constants & Utils
import { columnShowListWarehouseDetailInventory, actionType } from "views/WarehouseView/constants";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { fDate } from "utils/dateUtil";
import { dd_MM_yyyy } from "constants/time";
import { ROLE_TAB } from "constants/rolesTab";
import { getColumnsShow, handleChangeColumnOrders } from "utils/tableUtil";
import { compareStringSearch } from "utils/helpers";

// -------------------------------------------------------------------
interface Props {
  data?: WarehouseType;
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

const storeInventory = (state: InitialState, action: any) => {
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

const Inventory = (props: Props) => {
  const { data: dataProps } = props;
  const { newCancelToken } = useCancelToken();
  const [state, dispatch] = useReducer(storeInventory, initState);

  // State
  const [columnWidths, setColumnWidths] = useState<TableColumnWidthInfo[]>(
    columnShowListWarehouseDetailInventory.columnWidths
  );
  const [columnsShowHeader, setColumnsShowHeader] = useState<ColumnTypeDefault<any>[]>(
    getColumnsShow(columnShowListWarehouseDetailInventory.columnsShowHeader)
  );
  const [filterDate, setFilterDate] = useState<Date>(new Date());
  const [search, setSearch] = useState("");

  const { data, loading, params, dataTotal } = state;

  useEffect(() => {
    if (dataProps) {
      getListInventory({
        ...params,
        warehouse: dataProps.id,
      });
    }
  }, [filterDate, params]);

  const getListInventory = async (params: Partial<unknown>) => {
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
      "inventory/"
    );

    if (result && result.data) {
      const { results = [], count } = result.data;
      const newData = map(results, (item: any) => {
        return {
          ...item,
          variant_batch: getObjectPropSafely(() => item.variant_batch.batch_name),
          thumb_img_variant: getObjectPropSafely(() => item.variant_batch.variant.image.url),
          expiry_date: fDate(
            getObjectPropSafely(() => item.variant_batch.expiry_date),
            dd_MM_yyyy
          ),
          variant: {
            value: getObjectPropSafely(() => item.variant_batch.variant.name),
            props: {
              href: `/${ROLE_TAB.PRODUCT}/${getObjectPropSafely(
                () => item.variant_batch.variant.id
              )}`,
            },
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

  const handleOrderColumn = (columns: any) => {
    const newColumns = handleChangeColumnOrders(columns, columnsShowHeader);

    setColumnsShowHeader(newColumns.resultColumnsShow);
  };

  const renderHeader = () => {
    return (
      <HeaderFilter
        contentOptionalLeft={
          <TextField
            fullWidth
            label="Tìm kiếm"
            size="small"
            placeholder="Tìm theo tên sản phẩm"
            sx={{ width: 300 }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        }
        // contentOptional={
        //   <MDatePicker
        //     views={["year", "month", "day"]}
        //     label="Thời gian"
        //     minDate={new Date("2012-03-01")}
        //     // maxDate={new Date("2025-06-01")}
        //     value={filterDate}
        //     onChangeDate={setFilterDate}
        //   />
        // }
        columns={{
          columnsShow: columnsShowHeader,
          resultColumnsShow: columnsShowHeader,
        }}
      />
    );
  };

  const newData = useMemo(() => {
    return search ? filter(data, (item) => compareStringSearch(item?.variant.value, search)) : data;
  }, [search, data]);

  return (
    <DataGrid
      data={newData}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      isLoadingTable={loading}
      columns={columnsShowHeader}
      columnWidths={columnWidths}
      renderHeader={renderHeader}
      arrColumnThumbImg={["variant"]}
      arrColumnHandleLink={["variant"]}
      contentColumnShowInfo={{
        arrColumnShowInfo: ["variant_batch", "quantity", "expiry_date", "variant"],
        infoCell: columnShowListWarehouseDetailInventory.columnShowTable,
      }}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      setColumnWidths={setColumnWidths}
      handleChangeColumnOrder={handleOrderColumn}
    />
  );
};

export default Inventory;
