// Libraries
import { useEffect, useReducer, useContext, useMemo } from "react";

// Services
import { facebookApi } from "_apis_/facebook.api";

// Context
import { StoreReportFacebook } from "views/ReportFacebookView/contextStore";
import { useCancelToken } from "hooks/useCancelToken";

// Components
import HeaderFilter from "components/DDataGrid/containers/HeaderFilter";
import DDataGrid from "components/DDataGrid";
import TableDetail from "components/DDataGrid/components/TableDetail";
import { TabWrap } from "components/Tabs";

// Types
import { InitialStateReport } from "_types_/FacebookType";
import { SortType } from "_types_/SortType";

// Constants
import {
  actionType,
  keyFilter,
  headerFilterObjecttive,
  columnShowCampaignDetail,
  arrAttachUnitVnd,
  arrAttachUnitPercent,
  summaryColumnAttributes,
  summaryColumnCampaignDetail,
  arrTakeValueParamsHeader,
} from "views/ReportFacebookView/constants";
import { handleParamsHeaderFilter, handleParamsApi } from "utils/formatParamsUtil";

const initState: InitialStateReport = {
  data: [],
  loading: false,
  params: {
    page: 1,
    limit: 200,
    ordering: "-spend",
  },
  dataTotal: 0,
  totalRow: {},
};

const storeAttributes = (state: InitialStateReport, action: any) => {
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
    }
  }
};

const Attributes = () => {
  const [state, dispatch] = useReducer(storeAttributes, initState);
  const { state: store, dispatch: dispatchStore } = useContext(StoreReportFacebook);
  const { newCancelToken } = useCancelToken();
  const { listAttributes, attributes, params: paramsStore = "" } = store;

  const { data, loading, params, dataTotal, totalRow } = state;

  useEffect(() => {
    loadDataTable();
  }, [params, paramsStore]);

  const loadDataTable = () => {
    const objParams = handleParamsApi(
      {
        dimension: [listAttributes[0]?.id],
        ...params,
        ...paramsStore,
      },
      ["date_from", "date_to", "objective", "dimension"]
    );

    getListFacebookAttributes(objParams);
  };

  const getListFacebookAttributes = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: true,
        },
      });

      const result: any = await facebookApi.get(
        {
          ...params,
          cancelToken: newCancelToken(),
        },
        "report/attribute/"
      );

      if (result && result.data) {
        const { results = [], count, total = {} } = result.data;
        const newData = results.map((item: any) => {
          const { attributes } = item;

          return {
            ...item,
            id: attributes,
            searchName: attributes,
            attributeId: attributes,
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

  const handleChangePage = (page: number) => {
    dispatch({
      type: actionType.UPDATE_PARAMS,
      payload: {
        page,
      },
    });
  };

  const handleResizeColumns = (value: any) => {
    dispatchStore({
      type: actionType.RESIZE_COLUMN_ATTIBUTES,
      payload: {
        columnsWidthResize: value,
      },
    });
  };

  const handleChangeColumnOrder = (columns: string[]) => {
    dispatchStore({
      type: actionType.UPDATE_COLUMN_ORDER_ATTRIBUTES,
      payload: {
        columnsOrder: columns,
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

  const handleRefresh = () => {
    loadDataTable();
  };

  const handleChangeColumn = (column: any) => {
    dispatchStore({
      type: actionType.UPDATE_ATTRIBUTES,
      payload: column,
    });
  };

  const dataFilterAttributes = useMemo(() => {
    const newArr = listAttributes.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      };
    });

    return [...newArr];
  }, [listAttributes]);

  // const dataRenderHeaderMore = useMemo(() => {
  //   const paramsAttributesId = paramsStore.dimension;
  //   const arr = listAttributes.filter((item: any) => item.id !== paramsAttributesId);
  //   const newData = arr.map((item: any) => {
  //     const dataShow = item.data.map((value: any) => {
  //       return {
  //         label: value.name,
  //         value: value.id,
  //       };
  //     });

  //     return {
  //       style: {
  //         width: 200,
  //       },
  //       status: keyFilter.ATTIBUTES_VALUE,
  //       title: item.name,
  //       options: [
  //         {
  //           label: "Tất cả",
  //           value: "all",
  //         },
  //         ...dataShow,
  //       ],
  //       label: item.name,
  //       defaultValue: "all",
  //       simpleSelect: true,
  //     };
  //   });
  //   return newData;
  // }, [paramsStore.dimension, listAttributes]);

  const newParamsStore = useMemo(() => {
    return handleParamsHeaderFilter(paramsStore, [
      "objective",
      "dimension",
      ...arrTakeValueParamsHeader,
    ]);
  }, [paramsStore]);

  const renderHeader = () => {
    const dataRenderHeader = [
      {
        style: {
          width: 180,
        },
        status: keyFilter.OBJECTIVE,
        title: "Mục tiêu",
        options: headerFilterObjecttive,
        label: "objective",
        defaultValue: headerFilterObjecttive[0].value,
      },
      {
        style: {
          width: 200,
        },
        status: keyFilter.ATTIBUTES,
        title: "Thuộc tính",
        options: dataFilterAttributes,
        label: "dimension",
        defaultValue: dataFilterAttributes[0]?.value,
      },
    ];

    return (
      <HeaderFilter
        columnsCount={attributes.countShowColumn}
        originColumns={attributes.columnsShow}
        dataRenderHeader={dataRenderHeader}
        // dataRenderHeaderMore={dataRenderHeaderMore}
        params={newParamsStore}
        handleFilter={handleFilter}
        handleRefresh={handleRefresh}
        onChangeColumn={handleChangeColumn}
      />
    );
  };

  const renderTableDetail = (row: any, value: number) => {
    const paramsDetail = {
      campaign_id: row.campaigns,
    };

    return (
      <TabWrap value={value} index={0}>
        <TableDetail
          host={facebookApi}
          params={paramsDetail}
          columnShowDetail={columnShowCampaignDetail}
          summaryDataColumns={summaryColumnCampaignDetail}
          endpoint="report/marketing/campaign/"
        />
      </TabWrap>
    );
  };

  const columnOrders = useMemo(() => {
    return attributes.resultColumnsShow.map((item) => item.name);
  }, [attributes.resultColumnsShow]);

  return (
    <DDataGrid
      data={data}
      dataTotal={dataTotal}
      page={params.page}
      pageSize={params.limit}
      columns={attributes.resultColumnsShow}
      columnWidths={attributes.columnsWidthResize}
      columnOrders={columnOrders}
      totalSummaryRow={totalRow}
      arrAttachUnitVnd={arrAttachUnitVnd}
      arrAttachUnitPercent={arrAttachUnitPercent}
      isLoadingTable={loading}
      listTabDetail={["campaign"]}
      summaryDataColumns={summaryColumnAttributes}
      renderHeader={renderHeader}
      renderTableDetail={renderTableDetail}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleChangePage={handleChangePage}
      handleSorting={handleChangeSorting}
      setColumnWidths={handleResizeColumns}
      handleChangeColumnOrder={handleChangeColumnOrder}
    />
  );
};
export default Attributes;
